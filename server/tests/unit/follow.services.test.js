import { jest } from "@jest/globals";

const mockFollowCreate = jest.fn();
const mockFollowFindOneAndDelete = jest.fn();
const mockFollowFind = jest.fn();
const mockCreateNotification = jest.fn();

jest.unstable_mockModule("../../src/modules/follows/follow.model.js", () => {
  const chain = {
    populate: jest.fn().mockReturnThis(),
    sort: jest.fn().mockResolvedValue([]),
  };
  return {
    default: {
      create: mockFollowCreate,
      findOneAndDelete: mockFollowFindOneAndDelete,
      find: jest.fn(() => chain),
      findOne: jest.fn(),
    },
  };
});

jest.unstable_mockModule(
  "../../src/modules/notifications/notification.services.js",
  () => ({
    default: {
      createNotification: mockCreateNotification,
    },
  }),
);

jest.unstable_mockModule("../../src/common/utils/apiError.js", () => {
  class ApiError extends Error {
    constructor(statusCode, message) {
      super(message);
      this.statusCode = statusCode;
    }
  }
  return { default: ApiError };
});

const followServices = (
  await import("../../src/modules/follows/follow.services.js")
).default;

beforeEach(() => {
  jest.clearAllMocks();
});

describe("follow.services.followUser", () => {
  it("should throw 400 when user tries to follow themselves", async () => {
    await expect(
      followServices.followUser("user1", "user1", "space1"),
    ).rejects.toMatchObject({
      statusCode: 400,
      message: "You cannot follow yourself",
    });

    expect(mockFollowCreate).not.toHaveBeenCalled();
  });

  it("should throw 400 on duplicate follow (unique index violation)", async () => {
    const dupError = new Error("duplicate");
    dupError.code = 11000;
    mockFollowCreate.mockRejectedValue(dupError);

    await expect(
      followServices.followUser("user1", "user2", "space1"),
    ).rejects.toMatchObject({
      statusCode: 400,
      message: expect.stringContaining("already following"),
    });
  });

  it("should create follow and send notification on success", async () => {
    const fakeFollow = {
      _id: "follow1",
      follower: "user1",
      following: "user2",
      space: "space1",
    };
    mockFollowCreate.mockResolvedValue(fakeFollow);
    mockCreateNotification.mockResolvedValue(null);

    const result = await followServices.followUser("user1", "user2", "space1");

    expect(result).toEqual(fakeFollow);
    expect(mockCreateNotification).toHaveBeenCalledWith(
      "user2",
      "user1",
      "follow",
    );
  });
});

describe("follow.services.unfollowUser", () => {
  it("should throw 404 when follow relationship does not exist", async () => {
    mockFollowFindOneAndDelete.mockResolvedValue(null);

    await expect(
      followServices.unfollowUser("user1", "user2", "space1"),
    ).rejects.toMatchObject({
      statusCode: 404,
    });
  });

  it("should delete follow relationship on success", async () => {
    mockFollowFindOneAndDelete.mockResolvedValue({ _id: "follow1" });

    await followServices.unfollowUser("user1", "user2", "space1");

    expect(mockFollowFindOneAndDelete).toHaveBeenCalledWith({
      follower: "user1",
      following: "user2",
      space: "space1",
    });
  });
});
