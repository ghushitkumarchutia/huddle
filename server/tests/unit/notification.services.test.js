import { jest } from "@jest/globals";

const mockNotificationCreate = jest.fn();
const mockNotificationFindById = jest.fn();
const mockNotificationFind = jest.fn();
const mockUserFindById = jest.fn();

jest.unstable_mockModule(
  "../../src/modules/notifications/notification.model.js",
  () => {
    const chain = {
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      populate: jest.fn().mockResolvedValue([]),
    };
    return {
      default: {
        create: mockNotificationCreate,
        findById: mockNotificationFindById,
        find: jest.fn(() => chain),
      },
    };
  },
);

jest.unstable_mockModule("../../src/modules/users/user.model.js", () => ({
  default: {
    findById: mockUserFindById,
  },
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

const notificationServices = (
  await import("../../src/modules/notifications/notification.services.js")
).default;

beforeEach(() => {
  jest.clearAllMocks();
});

describe("notification.services.createNotification", () => {
  it("should not create notification when actor is the recipient (self-action)", async () => {
    const result = await notificationServices.createNotification(
      "user1",
      "user1",
      "like",
      "post1",
    );

    expect(result).toBeNull();
    expect(mockNotificationCreate).not.toHaveBeenCalled();
  });

  it("should not create notification when recipient does not exist", async () => {
    mockUserFindById.mockResolvedValue(null);

    const result = await notificationServices.createNotification(
      "nonexistent",
      "user2",
      "like",
      "post1",
    );

    expect(result).toBeNull();
    expect(mockNotificationCreate).not.toHaveBeenCalled();
  });

  it("should respect notification preferences — likes disabled", async () => {
    mockUserFindById.mockResolvedValue({
      _id: "user1",
      notificationPreferences: { likes: false, comments: true, follows: true },
    });

    const result = await notificationServices.createNotification(
      "user1",
      "user2",
      "like",
      "post1",
    );

    expect(result).toBeNull();
    expect(mockNotificationCreate).not.toHaveBeenCalled();
  });

  it("should create notification when preferences allow it", async () => {
    mockUserFindById.mockResolvedValue({
      _id: "user1",
      notificationPreferences: { likes: true },
    });
    mockNotificationCreate.mockResolvedValue({
      _id: "notif1",
      recipient: "user1",
    });

    const result = await notificationServices.createNotification(
      "user1",
      "user2",
      "like",
      "post1",
    );

    expect(mockNotificationCreate).toHaveBeenCalledWith({
      recipient: "user1",
      actor: "user2",
      type: "like",
      post: "post1",
    });
    expect(result).toBeDefined();
  });

  it("should create notification when preferences are undefined (default on)", async () => {
    mockUserFindById.mockResolvedValue({
      _id: "user1",
      notificationPreferences: undefined,
    });
    mockNotificationCreate.mockResolvedValue({ _id: "notif1" });

    await notificationServices.createNotification("user1", "user2", "follow");

    expect(mockNotificationCreate).toHaveBeenCalled();
  });
});

describe("notification.services.markAsRead", () => {
  it("should throw 404 when notification does not exist", async () => {
    mockNotificationFindById.mockResolvedValue(null);

    await expect(
      notificationServices.markAsRead("user1", "nonexistent"),
    ).rejects.toMatchObject({
      statusCode: 404,
    });
  });

  it("should throw 403 when user tries to mark another user's notification", async () => {
    mockNotificationFindById.mockResolvedValue({
      _id: "notif1",
      recipient: { toString: () => "otherUser" },
      isRead: false,
      save: jest.fn(),
    });

    await expect(
      notificationServices.markAsRead("user1", "notif1"),
    ).rejects.toMatchObject({
      statusCode: 403,
    });
  });
});
