import { jest } from "@jest/globals";

const mockOrgFindOne = jest.fn();
const mockOrgCreate = jest.fn();
const mockOrgFindByIdAndUpdate = jest.fn();
const mockOrgMembershipCreate = jest.fn();

jest.unstable_mockModule(
  "../../src/modules/organizations/organization.model.js",
  () => ({
    default: {
      findOne: mockOrgFindOne,
      create: mockOrgCreate,
      findByIdAndUpdate: mockOrgFindByIdAndUpdate,
    },
  }),
);

jest.unstable_mockModule(
  "../../src/modules/organizationMemberships/orgMembership.model.js",
  () => ({
    default: {
      create: mockOrgMembershipCreate,
    },
  }),
);

jest.unstable_mockModule(
  "../../src/modules/spaceMemberships/spaceMembership.model.js",
  () => ({
    default: {},
  }),
);
jest.unstable_mockModule("../../src/modules/spaces/space.model.js", () => ({
  default: {},
}));
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

jest.unstable_mockModule("../../src/common/utils/apiError.js", () => {
  class ApiError extends Error {
    constructor(statusCode, message) {
      super(message);
      this.statusCode = statusCode;
    }
  }
  return { default: ApiError };
});

const orgServices = (
  await import("../../src/modules/organizations/organization.services.js")
).default;

beforeEach(() => {
  jest.clearAllMocks();
});

describe("organization.services.createOrganization — mass assignment prevention", () => {
  it("should not allow attacker to set memberCount via request body", async () => {
    mockOrgFindOne.mockResolvedValue(null);
    mockOrgCreate.mockImplementation((data) => ({
      _id: "org1",
      ...data,
    }));
    mockOrgMembershipCreate.mockResolvedValue({});

    const maliciousData = {
      name: "Evil Org",
      slug: "evil-org",
      memberCount: 999999,
    };

    await orgServices.createOrganization("user1", maliciousData);

    const createArg = mockOrgCreate.mock.calls[0][0];
    expect(createArg.memberCount).toBe(1);
  });

  it("should not allow attacker to set createdBy via request body", async () => {
    mockOrgFindOne.mockResolvedValue(null);
    mockOrgCreate.mockImplementation((data) => ({
      _id: "org1",
      ...data,
    }));
    mockOrgMembershipCreate.mockResolvedValue({});

    const maliciousData = {
      name: "Evil Org",
      slug: "evil-org",
      createdBy: "someOtherUserId",
    };

    await orgServices.createOrganization("user1", maliciousData);

    const createArg = mockOrgCreate.mock.calls[0][0];
    expect(createArg.createdBy).toBe("user1");
  });

  it("should only pass whitelisted fields to Organization.create", async () => {
    mockOrgFindOne.mockResolvedValue(null);
    mockOrgCreate.mockImplementation((data) => ({
      _id: "org1",
      ...data,
    }));
    mockOrgMembershipCreate.mockResolvedValue({});

    const maliciousData = {
      name: "Good Org",
      slug: "good-org",
      description: "A good org",
      type: "company",
      joinPolicy: "invite",
      _id: "injected_id",
      __proto__: { admin: true },
    };

    await orgServices.createOrganization("user1", maliciousData);

    const createArg = mockOrgCreate.mock.calls[0][0];
    expect(createArg._id).toBeUndefined();
    expect(createArg.name).toBe("Good Org");
    expect(createArg.slug).toBe("good-org");
  });

  it("should throw 400 when slug already exists", async () => {
    mockOrgFindOne.mockResolvedValue({ _id: "existingOrg" });

    await expect(
      orgServices.createOrganization("user1", {
        name: "Dup",
        slug: "existing-slug",
      }),
    ).rejects.toMatchObject({
      statusCode: 400,
    });
  });

  it("should create owner membership for the creator", async () => {
    mockOrgFindOne.mockResolvedValue(null);
    mockOrgCreate.mockResolvedValue({ _id: "org1" });
    mockOrgMembershipCreate.mockResolvedValue({});

    await orgServices.createOrganization("user1", {
      name: "Org",
      slug: "org",
    });

    expect(mockOrgMembershipCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        organization: "org1",
        user: "user1",
        role: "owner",
        status: "active",
      }),
    );
  });
});

describe("organization.services.updateOrganization — mass assignment prevention", () => {
  it("should not allow setting createdBy, memberCount, or slug via update", async () => {
    mockOrgFindByIdAndUpdate.mockResolvedValue({
      _id: "org1",
      name: "Updated",
    });

    await orgServices.updateOrganization("org1", {
      name: "Updated",
      createdBy: "attacker",
      memberCount: 999999,
      slug: "hacked-slug",
    });

    const updateArg = mockOrgFindByIdAndUpdate.mock.calls[0][1];
    expect(updateArg.createdBy).toBeUndefined();
    expect(updateArg.memberCount).toBeUndefined();
    expect(updateArg.slug).toBeUndefined();
    expect(updateArg.name).toBe("Updated");
  });
});
