const ORG_PERMISSIONS = {
  owner: [
    "organization.view",
    "organization.update",
    "organization.delete",
    "organization.manage_members",
    "organization.manage_roles",
    "organization.manage_spaces",
    "organization.moderate",
  ],
  admin: [
    "organization.view",
    "organization.update",
    "organization.manage_members",
    "organization.manage_spaces",
    "organization.moderate",
  ],
  moderator: ["organization.view", "organization.moderate"],
  member: ["organization.view"],
};

const SPACE_PERMISSIONS = {
  space_admin: [
    "space.view",
    "space.update",
    "space.manage_members",
    "space.manage_groups",
    "space.moderate",
    "space.create_posts",
  ],
  moderator: ["space.view", "space.moderate", "space.create_posts"],
  member: ["space.view", "space.create_posts"],
};

const hasOrgPermission = (role, permission) => {
  const permissions = ORG_PERMISSIONS[role];
  if (!permissions) return false;
  return permissions.includes(permission);
};

const hasSpacePermission = (role, permission) => {
  const permissions = SPACE_PERMISSIONS[role];
  if (!permissions) return false;
  return permissions.includes(permission);
};

export {
  ORG_PERMISSIONS,
  SPACE_PERMISSIONS,
  hasOrgPermission,
  hasSpacePermission,
};
