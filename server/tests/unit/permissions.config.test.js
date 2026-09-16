import {
  hasOrgPermission,
  hasSpacePermission,
} from "../../src/common/config/permissions.config.js";

describe("permissions.config — hasOrgPermission", () => {
  it("owner should have all organization permissions", () => {
    expect(hasOrgPermission("owner", "organization.view")).toBe(true);
    expect(hasOrgPermission("owner", "organization.update")).toBe(true);
    expect(hasOrgPermission("owner", "organization.delete")).toBe(true);
    expect(hasOrgPermission("owner", "organization.manage_members")).toBe(true);
    expect(hasOrgPermission("owner", "organization.manage_roles")).toBe(true);
    expect(hasOrgPermission("owner", "organization.manage_spaces")).toBe(true);
    expect(hasOrgPermission("owner", "organization.moderate")).toBe(true);
  });

  it("admin should NOT have delete or manage_roles permissions", () => {
    expect(hasOrgPermission("admin", "organization.delete")).toBe(false);
    expect(hasOrgPermission("admin", "organization.manage_roles")).toBe(false);
  });

  it("member should only have view permission", () => {
    expect(hasOrgPermission("member", "organization.view")).toBe(true);
    expect(hasOrgPermission("member", "organization.update")).toBe(false);
    expect(hasOrgPermission("member", "organization.manage_members")).toBe(
      false,
    );
  });

  it("should return false for unknown roles", () => {
    expect(hasOrgPermission("superadmin", "organization.view")).toBe(false);
    expect(hasOrgPermission(undefined, "organization.view")).toBe(false);
    expect(hasOrgPermission(null, "organization.view")).toBe(false);
  });

  it("should return false for unknown permissions", () => {
    expect(hasOrgPermission("owner", "organization.nonexistent")).toBe(false);
  });
});

describe("permissions.config — hasSpacePermission", () => {
  it("space_admin should have all space permissions", () => {
    expect(hasSpacePermission("space_admin", "space.view")).toBe(true);
    expect(hasSpacePermission("space_admin", "space.update")).toBe(true);
    expect(hasSpacePermission("space_admin", "space.manage_members")).toBe(
      true,
    );
    expect(hasSpacePermission("space_admin", "space.manage_groups")).toBe(true);
    expect(hasSpacePermission("space_admin", "space.moderate")).toBe(true);
    expect(hasSpacePermission("space_admin", "space.create_posts")).toBe(true);
  });

  it("member should have view and create_posts but not manage_groups", () => {
    expect(hasSpacePermission("member", "space.view")).toBe(true);
    expect(hasSpacePermission("member", "space.create_posts")).toBe(true);
    expect(hasSpacePermission("member", "space.manage_groups")).toBe(false);
    expect(hasSpacePermission("member", "space.update")).toBe(false);
  });

  it("should return false for unknown roles", () => {
    expect(hasSpacePermission("guest", "space.view")).toBe(false);
  });
});
