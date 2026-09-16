import { jest } from "@jest/globals";

const mockUserFindById = jest.fn();
const mockGroupFindById = jest.fn();
const mockPostCreate = jest.fn();
const mockPostFindById = jest.fn();
const mockPostFindByIdAndDelete = jest.fn();
const mockFeedItemInsertMany = jest.fn();
const mockFeedItemDeleteMany = jest.fn();
const mockLikeDeleteMany = jest.fn();
const mockCommentDeleteMany = jest.fn();
const mockListFollowers = jest.fn();

jest.unstable_mockModule("../../src/modules/users/user.model.js", () => ({
  default: {
    findById: mockUserFindById,
  },
}));

jest.unstable_mockModule("../../src/modules/groups/group.model.js", () => ({
  default: {
    findById: mockGroupFindById,
  },
}));

jest.unstable_mockModule("../../src/modules/posts/post.model.js", () => ({
  default: {
    create: mockPostCreate,
    findById: mockPostFindById,
    findByIdAndDelete: mockPostFindByIdAndDelete,
  },
}));

jest.unstable_mockModule("../../src/modules/feed/feed.model.js", () => ({
  default: {
    insertMany: mockFeedItemInsertMany,
    deleteMany: mockFeedItemDeleteMany,
  },
}));

jest.unstable_mockModule("../../src/modules/likes/like.model.js", () => ({
  default: {
    deleteMany: mockLikeDeleteMany,
  },
}));

jest.unstable_mockModule("../../src/modules/comments/comment.model.js", () => ({
  default: {
    deleteMany: mockCommentDeleteMany,
  },
}));

jest.unstable_mockModule(
  "../../src/modules/follows/follow.services.js",
  () => ({
    default: {
      listFollowers: mockListFollowers,
    },
  }),
);

jest.unstable_mockModule("../../src/common/utils/apiError.js", () => {
  class ApiError extends Error {
    constructor(statusCode, message, details = null) {
      super(message);
      this.statusCode = statusCode;
      this.details = details;
    }
  }
  return { default: ApiError };
});

const postServices = (await import("../../src/modules/posts/post.services.js"))
  .default;

beforeEach(() => {
  jest.clearAllMocks();
});

describe("post.services.createPost", () => {
  const userId = "author001";
  const spaceId = "space001";
  const groupId = "group001";
  const content = "Test post content";

  const fakeUser = {
    _id: userId,
    displayName: "Test User",
    username: "testuser",
    avatarUrl: "https://example.com/avatar.jpg",
  };

  const fakeGroup = {
    _id: groupId,
    name: "General",
    space: { toString: () => spaceId },
  };

  const fakePost = {
    _id: "post001",
    author: userId,
    authorSnapshot: {
      displayName: fakeUser.displayName,
      username: fakeUser.username,
      avatarUrl: fakeUser.avatarUrl,
    },
    space: spaceId,
    group: groupId,
    content,
    createdAt: new Date(),
  };

  it("should create exactly N+1 FeedItems for a user with N followers", async () => {
    const followers = [
      { follower: { _id: "follower1" } },
      { follower: { _id: "follower2" } },
      { follower: { _id: "follower3" } },
    ];

    mockUserFindById.mockResolvedValue(fakeUser);
    mockGroupFindById.mockResolvedValue(fakeGroup);
    mockPostCreate.mockResolvedValue(fakePost);
    mockListFollowers.mockResolvedValue(followers);
    mockFeedItemInsertMany.mockResolvedValue([]);

    await postServices.createPost(userId, spaceId, groupId, content, null);

    expect(mockFeedItemInsertMany).toHaveBeenCalledTimes(1);

    const insertedItems = mockFeedItemInsertMany.mock.calls[0][0];
    expect(insertedItems).toHaveLength(followers.length + 1);

    const ownerIds = insertedItems.map((item) => item.feedOwner);
    expect(ownerIds).toContain("follower1");
    expect(ownerIds).toContain("follower2");
    expect(ownerIds).toContain("follower3");
    expect(ownerIds).toContain(userId);
  });

  it("should create exactly 1 FeedItem (self) when user has 0 followers", async () => {
    mockUserFindById.mockResolvedValue(fakeUser);
    mockGroupFindById.mockResolvedValue(fakeGroup);
    mockPostCreate.mockResolvedValue(fakePost);
    mockListFollowers.mockResolvedValue([]);
    mockFeedItemInsertMany.mockResolvedValue([]);

    await postServices.createPost(userId, spaceId, groupId, content, null);

    const insertedItems = mockFeedItemInsertMany.mock.calls[0][0];
    expect(insertedItems).toHaveLength(1);
    expect(insertedItems[0].feedOwner).toBe(userId);
  });

  it("should set authorSnapshot matching the User document at creation time", async () => {
    mockUserFindById.mockResolvedValue(fakeUser);
    mockGroupFindById.mockResolvedValue(fakeGroup);
    mockPostCreate.mockResolvedValue(fakePost);
    mockListFollowers.mockResolvedValue([]);
    mockFeedItemInsertMany.mockResolvedValue([]);

    await postServices.createPost(userId, spaceId, groupId, content, null);

    const createArg = mockPostCreate.mock.calls[0][0];
    expect(createArg.authorSnapshot).toEqual({
      displayName: fakeUser.displayName,
      username: fakeUser.username,
      avatarUrl: fakeUser.avatarUrl,
    });
  });

  it("should filter out followers with null populated follower field", async () => {
    const followers = [
      { follower: { _id: "follower1" } },
      { follower: null },
      { follower: { _id: "follower3" } },
    ];

    mockUserFindById.mockResolvedValue(fakeUser);
    mockGroupFindById.mockResolvedValue(fakeGroup);
    mockPostCreate.mockResolvedValue(fakePost);
    mockListFollowers.mockResolvedValue(followers);
    mockFeedItemInsertMany.mockResolvedValue([]);

    await postServices.createPost(userId, spaceId, groupId, content, null);

    const insertedItems = mockFeedItemInsertMany.mock.calls[0][0];
    expect(insertedItems).toHaveLength(3);
  });

  it("should reject post creation when group does not belong to the space", async () => {
    const wrongSpaceGroup = {
      _id: groupId,
      name: "General",
      space: { toString: () => "differentSpaceId" },
    };

    mockUserFindById.mockResolvedValue(fakeUser);
    mockGroupFindById.mockResolvedValue(wrongSpaceGroup);

    await expect(
      postServices.createPost(userId, spaceId, groupId, content, null),
    ).rejects.toMatchObject({
      statusCode: 400,
      message: "Group does not belong to this space",
    });

    expect(mockPostCreate).not.toHaveBeenCalled();
  });

  it("should throw 404 when user does not exist", async () => {
    mockUserFindById.mockResolvedValue(null);

    await expect(
      postServices.createPost(userId, spaceId, groupId, content, null),
    ).rejects.toMatchObject({
      statusCode: 404,
      message: "User not found",
    });
  });

  it("should throw 404 when group does not exist", async () => {
    mockUserFindById.mockResolvedValue(fakeUser);
    mockGroupFindById.mockResolvedValue(null);

    await expect(
      postServices.createPost(userId, spaceId, groupId, content, null),
    ).rejects.toMatchObject({
      statusCode: 404,
      message: "Group not found",
    });
  });

  it("should set visibility to space-wide for announcement groups", async () => {
    const announcementGroup = {
      _id: groupId,
      name: "Announcements",
      space: { toString: () => spaceId },
    };

    mockUserFindById.mockResolvedValue(fakeUser);
    mockGroupFindById.mockResolvedValue(announcementGroup);
    mockPostCreate.mockResolvedValue(fakePost);
    mockListFollowers.mockResolvedValue([]);
    mockFeedItemInsertMany.mockResolvedValue([]);

    await postServices.createPost(userId, spaceId, groupId, content, null);

    const createArg = mockPostCreate.mock.calls[0][0];
    expect(createArg.visibility).toBe("space-wide");
  });
});

describe("post.services.deletePost", () => {
  it("should delete post and all associated feed items, likes, comments", async () => {
    const fakePost = {
      _id: "post001",
      author: { toString: () => "user001" },
    };
    mockPostFindById.mockResolvedValue(fakePost);
    mockPostFindByIdAndDelete.mockResolvedValue({});
    mockFeedItemDeleteMany.mockResolvedValue({});
    mockLikeDeleteMany.mockResolvedValue({});
    mockCommentDeleteMany.mockResolvedValue({});

    await postServices.deletePost("user001", "post001");

    expect(mockPostFindByIdAndDelete).toHaveBeenCalledWith("post001");
    expect(mockFeedItemDeleteMany).toHaveBeenCalledWith({ post: "post001" });
    expect(mockLikeDeleteMany).toHaveBeenCalledWith({ post: "post001" });
    expect(mockCommentDeleteMany).toHaveBeenCalledWith({ post: "post001" });
  });

  it("should throw 403 when non-author tries to delete", async () => {
    const fakePost = {
      _id: "post001",
      author: { toString: () => "user001" },
    };
    mockPostFindById.mockResolvedValue(fakePost);

    await expect(
      postServices.deletePost("otherUser", "post001"),
    ).rejects.toMatchObject({
      statusCode: 403,
    });
  });

  it("should throw 404 when post does not exist", async () => {
    mockPostFindById.mockResolvedValue(null);

    await expect(
      postServices.deletePost("user001", "nonexistent"),
    ).rejects.toMatchObject({
      statusCode: 404,
    });
  });
});
