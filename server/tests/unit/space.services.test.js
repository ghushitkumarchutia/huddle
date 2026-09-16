import { jest } from "@jest/globals";

const mockSpaceFindByIdAndUpdate = jest.fn();

jest.unstable_mockModule("../../src/modules/spaces/space.model.js", () => ({
  default: {
    findByIdAndUpdate: mockSpaceFindByIdAndUpdate,
  },
}));

jest.unstable_mockModule("../../src/common/utils/cache.utils.js", () => ({
  getOrSetCache: jest.fn(async (key, ttl, fn) => fn()),
  invalidateCache: jest.fn().mockResolvedValue(),
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

jest.unstable_mockModule(
  "../../src/modules/organizationMemberships/orgMembership.model.js",
  () => ({
    default: {},
  }),
);
jest.unstable_mockModule(
  "../../src/modules/spaceMemberships/spaceMembership.model.js",
  () => ({
    default: {},
  }),
);
jest.unstable_mockModule(
  "../../src/modules/organizations/organization.model.js",
  () => ({
    default: {},
  }),
);
jest.unstable_mockModule("../../src/modules/posts/post.model.js", () => ({
  default: {},
}));
jest.unstable_mockModule("../../src/modules/feed/feed.model.js", () => ({
  default: {},
}));
jest.unstable_mockModule("../../src/modules/follows/follow.model.js", () => ({
  default: {},
}));
jest.unstable_mockModule("../../src/modules/likes/like.model.js", () => ({
  default: {},
}));
jest.unstable_mockModule("../../src/modules/comments/comment.model.js", () => ({
  default: {},
}));
jest.unstable_mockModule("../../src/modules/groups/group.model.js", () => ({
  default: {},
}));

const spaceServices = (
  await import("../../src/modules/spaces/space.services.js")
).default;

beforeEach(() => {
  jest.clearAllMocks();
});

describe("space.services.updateSpace — mass assignment prevention", () => {
  it("should not allow setting organization, inviteCode, memberCount, or createdBy", async () => {
    mockSpaceFindByIdAndUpdate.mockResolvedValue({
      _id: "space1",
      name: "Updated",
      organization: "org1",
    });

    await spaceServices.updateSpace("space1", {
      name: "Updated",
      organization: "attackerOrg",
      inviteCode: "HACKED",
      memberCount: 999999,
      createdBy: "attacker",
    });

    const updateArg = mockSpaceFindByIdAndUpdate.mock.calls[0][1];
    expect(updateArg.organization).toBeUndefined();
    expect(updateArg.inviteCode).toBeUndefined();
    expect(updateArg.memberCount).toBeUndefined();
    expect(updateArg.createdBy).toBeUndefined();
    expect(updateArg.name).toBe("Updated");
  });

  it("should only pass name and description to update", async () => {
    mockSpaceFindByIdAndUpdate.mockResolvedValue({
      _id: "space1",
      name: "Test",
      organization: "org1",
    });

    await spaceServices.updateSpace("space1", {
      name: "New Name",
      description: "New Desc",
    });

    const updateArg = mockSpaceFindByIdAndUpdate.mock.calls[0][1];
    expect(Object.keys(updateArg).sort()).toEqual(
      ["description", "name"].sort(),
    );
  });

  it("should throw 404 when space not found", async () => {
    mockSpaceFindByIdAndUpdate.mockResolvedValue(null);

    await expect(
      spaceServices.updateSpace("nonexistent", { name: "X" }),
    ).rejects.toMatchObject({
      statusCode: 404,
    });
  });
});
