import { jest } from "@jest/globals";

const mockUserFindById = jest.fn();
const mockUserFindByIdAndUpdate = jest.fn();
const mockUserFindByIdAndDelete = jest.fn();
const mockOrgMembershipFindOne = jest.fn();
const mockOrgMembershipFind = jest.fn();
const mockOrgMembershipDeleteMany = jest.fn();
const mockSpaceMembershipFind = jest.fn();
const mockSpaceMembershipDeleteMany = jest.fn();
const mockSpaceUpdateMany = jest.fn();
const mockOrgUpdateMany = jest.fn();
const mockPostFind = jest.fn();
const mockPostDeleteMany = jest.fn();
const mockFeedItemDeleteMany = jest.fn();
const mockFollowDeleteMany = jest.fn();
const mockLikeDeleteMany = jest.fn();
const mockCommentDeleteMany = jest.fn();
const mockNotificationDeleteMany = jest.fn();
const mockRefreshTokenDeleteMany = jest.fn();

jest.unstable_mockModule("../../src/modules/users/user.model.js", () => ({
  default: {
    findById: mockUserFindById,
    findByIdAndUpdate: mockUserFindByIdAndUpdate,
    findByIdAndDelete: mockUserFindByIdAndDelete,
  },
}));

jest.unstable_mockModule(
  "../../src/modules/organizationMemberships/orgMembership.model.js",
  () => ({
    default: {
      findOne: mockOrgMembershipFindOne,
      find: mockOrgMembershipFind,
      deleteMany: mockOrgMembershipDeleteMany,
    },
  }),
);

jest.unstable_mockModule(
  "../../src/modules/spaceMemberships/spaceMembership.model.js",
  () => ({
    default: {
      find: mockSpaceMembershipFind,
      deleteMany: mockSpaceMembershipDeleteMany,
    },
  }),
);

jest.unstable_mockModule("../../src/modules/spaces/space.model.js", () => ({
  default: {
    updateMany: mockSpaceUpdateMany,
  },
}));

jest.unstable_mockModule(
  "../../src/modules/organizations/organization.model.js",
  () => ({
    default: {
      updateMany: mockOrgUpdateMany,
    },
  }),
);

jest.unstable_mockModule("../../src/modules/follows/follow.model.js", () => ({
  default: { deleteMany: mockFollowDeleteMany },
}));

jest.unstable_mockModule("../../src/modules/posts/post.model.js", () => {
  const mockSelect = jest.fn().mockResolvedValue([]);
  return {
    default: {
      find: jest.fn(() => ({ select: mockSelect })),
      deleteMany: mockPostDeleteMany,
    },
  };
});

jest.unstable_mockModule("../../src/modules/feed/feed.model.js", () => ({
  default: { deleteMany: mockFeedItemDeleteMany },
}));

jest.unstable_mockModule("../../src/modules/likes/like.model.js", () => ({
  default: { deleteMany: mockLikeDeleteMany },
}));

jest.unstable_mockModule("../../src/modules/comments/comment.model.js", () => ({
  default: { deleteMany: mockCommentDeleteMany },
}));

jest.unstable_mockModule(
  "../../src/modules/notifications/notification.model.js",
  () => ({
    default: { deleteMany: mockNotificationDeleteMany },
  }),
);

jest.unstable_mockModule("../../src/models/refreshToken.model.js", () => ({
  default: { deleteMany: mockRefreshTokenDeleteMany },
}));

jest.unstable_mockModule("../../src/common/utils/hash.utils.js", () => ({
  hashPassword: jest.fn(async (pw) => `hashed_${pw}`),
  comparePassword: jest.fn(async (pw, hash) => hash === `hashed_${pw}`),
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

const userServices = (await import("../../src/modules/users/user.services.js"))
  .default;

beforeEach(() => {
  jest.clearAllMocks();
});

describe("user.services.updateProfile — mass assignment prevention", () => {
  it("should not allow setting email, role, or passwordHash via update", async () => {
    mockUserFindByIdAndUpdate.mockResolvedValue({ _id: "user1" });

    await userServices.updateProfile("user1", {
      displayName: "Updated",
      email: "hacked@evil.com",
      role: "admin",
      passwordHash: "injected",
    });

    const updateArg = mockUserFindByIdAndUpdate.mock.calls[0][1];
    expect(updateArg.email).toBeUndefined();
    expect(updateArg.role).toBeUndefined();
    expect(updateArg.passwordHash).toBeUndefined();
    expect(updateArg.displayName).toBe("Updated");
  });

  it("should only whitelist displayName, bio, avatarUrl, username", async () => {
    mockUserFindByIdAndUpdate.mockResolvedValue({ _id: "user1" });

    await userServices.updateProfile("user1", {
      displayName: "Name",
      bio: "Bio",
      avatarUrl: "url",
      username: "newname",
      _id: "injected",
      spaces: ["injected"],
    });

    const updateArg = mockUserFindByIdAndUpdate.mock.calls[0][1];
    expect(Object.keys(updateArg).sort()).toEqual(
      ["avatarUrl", "bio", "displayName", "username"].sort(),
    );
  });
});

describe("user.services.deleteAccount — ordering guarantees", () => {
  it("should block deletion when user is org owner", async () => {
    mockOrgMembershipFindOne.mockResolvedValue({
      _id: "membership1",
      role: "owner",
    });

    await expect(userServices.deleteAccount("user1")).rejects.toMatchObject({
      statusCode: 400,
      message: expect.stringContaining("owner"),
    });

    expect(mockUserFindByIdAndDelete).not.toHaveBeenCalled();
  });

  it("should delete user LAST after all cleanup", async () => {
    const callOrder = [];
    mockOrgMembershipFindOne.mockResolvedValue(null);
    mockUserFindById.mockResolvedValue({ _id: "user1" });
    mockSpaceMembershipFind.mockResolvedValue([]);
    mockOrgMembershipFind.mockResolvedValue([]);
    mockOrgMembershipDeleteMany.mockImplementation(() => {
      callOrder.push("orgMembershipDelete");
      return Promise.resolve();
    });
    mockSpaceMembershipDeleteMany.mockImplementation(() => {
      callOrder.push("spaceMembershipDelete");
      return Promise.resolve();
    });
    mockPostDeleteMany.mockImplementation(() => {
      callOrder.push("postDelete");
      return Promise.resolve();
    });
    mockFeedItemDeleteMany.mockImplementation(() => {
      callOrder.push("feedItemDelete");
      return Promise.resolve();
    });
    mockFollowDeleteMany.mockImplementation(() => {
      callOrder.push("followDelete");
      return Promise.resolve();
    });
    mockLikeDeleteMany.mockImplementation(() => {
      callOrder.push("likeDelete");
      return Promise.resolve();
    });
    mockCommentDeleteMany.mockImplementation(() => {
      callOrder.push("commentDelete");
      return Promise.resolve();
    });
    mockNotificationDeleteMany.mockImplementation(() => {
      callOrder.push("notificationDelete");
      return Promise.resolve();
    });
    mockRefreshTokenDeleteMany.mockImplementation(() => {
      callOrder.push("refreshTokenDelete");
      return Promise.resolve();
    });
    mockUserFindByIdAndDelete.mockImplementation(() => {
      callOrder.push("userDelete");
      return Promise.resolve({ _id: "user1" });
    });

    await userServices.deleteAccount("user1");

    expect(callOrder[callOrder.length - 1]).toBe("userDelete");
    expect(mockUserFindByIdAndDelete).toHaveBeenCalledWith("user1");
  });

  it("should throw 404 when user does not exist", async () => {
    mockOrgMembershipFindOne.mockResolvedValue(null);
    mockUserFindById.mockResolvedValue(null);

    await expect(
      userServices.deleteAccount("nonexistent"),
    ).rejects.toMatchObject({
      statusCode: 404,
    });
  });
});

describe("user.services.changePassword", () => {
  it("should throw 400 on incorrect current password", async () => {
    mockUserFindById.mockReturnValue({
      select: jest.fn().mockResolvedValue({
        _id: "user1",
        passwordHash: "hashed_CorrectPass",
        save: jest.fn(),
      }),
    });

    await expect(
      userServices.changePassword("user1", "WrongPass", "NewPass"),
    ).rejects.toMatchObject({
      statusCode: 400,
      message: "Incorrect current password",
    });
  });
});
