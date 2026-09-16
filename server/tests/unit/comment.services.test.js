import { jest } from "@jest/globals";

const mockCommentCreate = jest.fn();
const mockCommentFindById = jest.fn();
const mockCommentFindByIdAndDelete = jest.fn();
const mockCommentFind = jest.fn();
const mockPostFindById = jest.fn();
const mockPostFindByIdAndUpdate = jest.fn();
const mockUserFindById = jest.fn();
const mockCreateNotification = jest.fn();
const mockEmitCommentCountUpdate = jest.fn();
const mockGetIo = jest.fn().mockReturnValue({});

jest.unstable_mockModule("../../src/modules/comments/comment.model.js", () => {
  const mockChain = {
    sort: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockResolvedValue([]),
  };
  return {
    default: {
      create: mockCommentCreate,
      findById: mockCommentFindById,
      findByIdAndDelete: mockCommentFindByIdAndDelete,
      find: jest.fn(() => mockChain),
    },
  };
});

jest.unstable_mockModule("../../src/modules/posts/post.model.js", () => ({
  default: {
    findById: mockPostFindById,
    findByIdAndUpdate: mockPostFindByIdAndUpdate,
  },
}));

jest.unstable_mockModule("../../src/modules/users/user.model.js", () => ({
  default: {
    findById: mockUserFindById,
  },
}));

jest.unstable_mockModule(
  "../../src/modules/notifications/notification.services.js",
  () => ({
    default: {
      createNotification: mockCreateNotification,
    },
  }),
);

jest.unstable_mockModule("../../src/sockets/engagement.socket.js", () => ({
  emitCommentCountUpdate: mockEmitCommentCountUpdate,
}));

jest.unstable_mockModule("../../src/sockets/socket.server.js", () => ({
  getIo: mockGetIo,
}));

jest.unstable_mockModule("../../src/common/utils/apiError.js", () => {
  class ApiError extends Error {
    constructor(statusCode, message) {
      super(message);
      this.statusCode = statusCode;
    }
  }
  return { default: ApiError };
});

const commentServices = (
  await import("../../src/modules/comments/comment.services.js")
).default;

beforeEach(() => {
  jest.clearAllMocks();
});

describe("comment.services.addComment", () => {
  it("should verify post exists before creating Comment", async () => {
    mockPostFindById.mockResolvedValue(null);

    await expect(
      commentServices.addComment("user1", "nonexistentPost", "hello"),
    ).rejects.toMatchObject({
      statusCode: 404,
      message: "Post not found",
    });

    expect(mockCommentCreate).not.toHaveBeenCalled();
  });

  it("should verify user exists before creating Comment", async () => {
    mockPostFindById.mockResolvedValue({ _id: "post1", author: "author1" });
    mockUserFindById.mockResolvedValue(null);

    await expect(
      commentServices.addComment("nonexistentUser", "post1", "hello"),
    ).rejects.toMatchObject({
      statusCode: 404,
      message: "User not found",
    });

    expect(mockCommentCreate).not.toHaveBeenCalled();
  });

  it("should create comment and increment commentCount on valid inputs", async () => {
    const fakePost = { _id: "post1", author: "author1" };
    const fakeUser = {
      _id: "user1",
      displayName: "User",
      username: "user1",
      avatarUrl: null,
    };
    const fakeComment = { _id: "comment1", post: "post1", author: "user1" };
    const updatedPost = { _id: "post1", author: "author1", commentCount: 3 };

    mockPostFindById.mockResolvedValue(fakePost);
    mockUserFindById.mockResolvedValue(fakeUser);
    mockCommentCreate.mockResolvedValue(fakeComment);
    mockPostFindByIdAndUpdate.mockResolvedValue(updatedPost);
    mockCreateNotification.mockResolvedValue(null);

    const result = await commentServices.addComment("user1", "post1", "hello");

    expect(result).toEqual(fakeComment);
    expect(mockCommentCreate).toHaveBeenCalled();
    expect(mockPostFindByIdAndUpdate).toHaveBeenCalledWith(
      "post1",
      { $inc: { commentCount: 1 } },
      { new: true },
    );
    expect(mockEmitCommentCountUpdate).toHaveBeenCalledWith({}, "post1", 3);
    expect(mockCreateNotification).toHaveBeenCalledWith(
      "author1",
      "user1",
      "comment",
      "post1",
    );
  });
});

describe("comment.services.deleteComment", () => {
  it("should throw 403 when non-author tries to delete", async () => {
    mockCommentFindById.mockResolvedValue({
      _id: "comment1",
      author: { toString: () => "user1" },
      post: "post1",
    });

    await expect(
      commentServices.deleteComment("otherUser", "comment1"),
    ).rejects.toMatchObject({
      statusCode: 403,
    });
  });

  it("should throw 404 when comment does not exist", async () => {
    mockCommentFindById.mockResolvedValue(null);

    await expect(
      commentServices.deleteComment("user1", "nonexistent"),
    ).rejects.toMatchObject({
      statusCode: 404,
    });
  });

  it("should delete and decrement commentCount", async () => {
    const fakeComment = {
      _id: "comment1",
      author: { toString: () => "user1" },
      post: "post1",
    };
    const updatedPost = { _id: "post1", commentCount: 2 };

    mockCommentFindById.mockResolvedValue(fakeComment);
    mockCommentFindByIdAndDelete.mockResolvedValue({});
    mockPostFindByIdAndUpdate.mockResolvedValue(updatedPost);

    await commentServices.deleteComment("user1", "comment1");

    expect(mockCommentFindByIdAndDelete).toHaveBeenCalledWith("comment1");
    expect(mockPostFindByIdAndUpdate).toHaveBeenCalledWith(
      "post1",
      { $inc: { commentCount: -1 } },
      { new: true },
    );
  });
});
