import { jest } from "@jest/globals";

const mockLikeCreate = jest.fn();
const mockLikeFindOneAndDelete = jest.fn();
const mockPostFindById = jest.fn();
const mockPostFindByIdAndUpdate = jest.fn();
const mockCreateNotification = jest.fn();
const mockEmitLikeCountUpdate = jest.fn();
const mockGetIo = jest.fn().mockReturnValue({});

jest.unstable_mockModule("../../src/modules/likes/like.model.js", () => ({
  default: {
    create: mockLikeCreate,
    findOneAndDelete: mockLikeFindOneAndDelete,
  },
}));

jest.unstable_mockModule("../../src/modules/posts/post.model.js", () => ({
  default: {
    findById: mockPostFindById,
    findByIdAndUpdate: mockPostFindByIdAndUpdate,
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
  emitLikeCountUpdate: mockEmitLikeCountUpdate,
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

const likeServices = (await import("../../src/modules/likes/like.services.js"))
  .default;

beforeEach(() => {
  jest.clearAllMocks();
});

describe("like.services.likePost", () => {
  it("should verify post exists before creating Like document", async () => {
    mockPostFindById.mockResolvedValue(null);

    await expect(
      likeServices.likePost("user1", "nonexistentPost"),
    ).rejects.toMatchObject({
      statusCode: 404,
      message: "Post not found",
    });

    expect(mockLikeCreate).not.toHaveBeenCalled();
  });

  it("should create a Like and increment likeCount on valid post", async () => {
    const fakePost = { _id: "post1", author: "author1" };
    const updatedPost = { _id: "post1", author: "author1", likeCount: 5 };

    mockPostFindById.mockResolvedValue(fakePost);
    mockLikeCreate.mockResolvedValue({});
    mockPostFindByIdAndUpdate.mockResolvedValue(updatedPost);
    mockCreateNotification.mockResolvedValue(null);

    await likeServices.likePost("user1", "post1");

    expect(mockPostFindById).toHaveBeenCalledWith("post1");
    expect(mockLikeCreate).toHaveBeenCalledWith({
      user: "user1",
      post: "post1",
    });
    expect(mockPostFindByIdAndUpdate).toHaveBeenCalledWith(
      "post1",
      { $inc: { likeCount: 1 } },
      { new: true },
    );
    expect(mockEmitLikeCountUpdate).toHaveBeenCalledWith({}, "post1", 5);
    expect(mockCreateNotification).toHaveBeenCalledWith(
      "author1",
      "user1",
      "like",
      "post1",
    );
  });

  it("should throw 400 on duplicate like (unique index violation)", async () => {
    const fakePost = { _id: "post1", author: "author1" };
    mockPostFindById.mockResolvedValue(fakePost);

    const duplicateError = new Error("E11000 duplicate key");
    duplicateError.code = 11000;
    mockLikeCreate.mockRejectedValue(duplicateError);

    await expect(likeServices.likePost("user1", "post1")).rejects.toMatchObject(
      {
        statusCode: 400,
        message: "You have already liked this post",
      },
    );
  });

  it("should propagate non-duplicate database errors", async () => {
    const fakePost = { _id: "post1", author: "author1" };
    mockPostFindById.mockResolvedValue(fakePost);
    mockLikeCreate.mockRejectedValue(new Error("Database connection lost"));

    await expect(likeServices.likePost("user1", "post1")).rejects.toThrow(
      "Database connection lost",
    );
  });
});

describe("like.services.unlikePost", () => {
  it("should delete the like and decrement likeCount", async () => {
    const updatedPost = { _id: "post1", likeCount: 3 };
    mockLikeFindOneAndDelete.mockResolvedValue({ _id: "like1" });
    mockPostFindByIdAndUpdate.mockResolvedValue(updatedPost);

    await likeServices.unlikePost("user1", "post1");

    expect(mockLikeFindOneAndDelete).toHaveBeenCalledWith({
      user: "user1",
      post: "post1",
    });
    expect(mockPostFindByIdAndUpdate).toHaveBeenCalledWith(
      "post1",
      { $inc: { likeCount: -1 } },
      { new: true },
    );
    expect(mockEmitLikeCountUpdate).toHaveBeenCalledWith({}, "post1", 3);
  });

  it("should throw 404 when like does not exist", async () => {
    mockLikeFindOneAndDelete.mockResolvedValue(null);

    await expect(
      likeServices.unlikePost("user1", "post1"),
    ).rejects.toMatchObject({
      statusCode: 404,
      message: "You have not liked this post",
    });
  });
});
