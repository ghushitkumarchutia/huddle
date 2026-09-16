import SpaceMembership from "./spaceMembership.model.js";
import OrgMembership from "../organizationMemberships/orgMembership.model.js";
import Space from "../spaces/space.model.js";
import ApiError from "../../common/utils/apiError.js";

const addMember = async (spaceId, targetUserId, role) => {
  const space = await Space.findById(spaceId);
  if (!space) {
    throw new ApiError(404, "Space not found");
  }

  const orgMembership = await OrgMembership.findOne({
    organization: space.organization,
    user: targetUserId,
    status: "active",
  });

  if (!orgMembership) {
    throw new ApiError(403, "User must be an active organization member first");
  }

  const existing = await SpaceMembership.findOne({
    space: spaceId,
    user: targetUserId,
  });

  if (existing && existing.status === "active") {
    throw new ApiError(400, "User is already an active space member");
  }

  if (existing) {
    existing.role = role || "member";
    existing.status = "active";
    existing.joinedAt = new Date();
    await existing.save();
    await Space.findByIdAndUpdate(spaceId, { $inc: { memberCount: 1 } });
    return existing;
  }

  const membership = await SpaceMembership.create({
    space: spaceId,
    user: targetUserId,
    role: role || "member",
    status: "active",
  });

  await Space.findByIdAndUpdate(spaceId, { $inc: { memberCount: 1 } });
  return membership;
};

const joinSpace = async (userId, inviteCode) => {
  const space = await Space.findOne({ inviteCode });
  if (!space) {
    throw new ApiError(404, "Space not found or invalid invite code");
  }

  const orgMembership = await OrgMembership.findOne({
    organization: space.organization,
    user: userId,
    status: "active",
  });

  if (!orgMembership) {
    throw new ApiError(
      403,
      "You must be an active organization member to join this space",
    );
  }

  const existing = await SpaceMembership.findOne({
    space: space._id,
    user: userId,
  });

  if (existing && existing.status === "active") {
    throw new ApiError(400, "You are already a member of this space");
  }

  if (existing) {
    existing.status = "active";
    existing.role = "member";
    existing.joinedAt = new Date();
    await existing.save();
    await Space.findByIdAndUpdate(space._id, { $inc: { memberCount: 1 } });
    return space;
  }

  await SpaceMembership.create({
    space: space._id,
    user: userId,
    role: "member",
    status: "active",
  });

  await Space.findByIdAndUpdate(space._id, { $inc: { memberCount: 1 } });
  return space;
};

const listMembers = async (spaceId) => {
  return SpaceMembership.find({
    space: spaceId,
    status: "active",
  })
    .populate("user", "displayName username avatarUrl")
    .sort({ joinedAt: -1 });
};

const changeRole = async (spaceId, targetUserId, newRole) => {
  const target = await SpaceMembership.findOne({
    space: spaceId,
    user: targetUserId,
    status: "active",
  });

  if (!target) {
    throw new ApiError(404, "Active space membership not found");
  }

  target.role = newRole;
  await target.save();
  return target;
};

const removeMember = async (spaceId, targetUserId, actorUserId) => {
  if (targetUserId.toString() === actorUserId.toString()) {
    throw new ApiError(400, "Cannot remove yourself from the space");
  }

  const target = await SpaceMembership.findOne({
    space: spaceId,
    user: targetUserId,
    status: "active",
  });

  if (!target) {
    throw new ApiError(404, "Active space membership not found");
  }

  target.status = "removed";
  await target.save();

  await Space.findByIdAndUpdate(spaceId, {
    $inc: { memberCount: -1 },
  });
};

export default {
  addMember,
  joinSpace,
  listMembers,
  changeRole,
  removeMember,
};
