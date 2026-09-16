import OrgMembership from "./orgMembership.model.js";
import Organization from "../organizations/organization.model.js";
import SpaceMembership from "../spaceMemberships/spaceMembership.model.js";
import Space from "../spaces/space.model.js";
import ApiError from "../../common/utils/apiError.js";

const addMember = async (organizationId, userId, role, type) => {
  const existing = await OrgMembership.findOne({
    organization: organizationId,
    user: userId,
  });

  if (existing && existing.status === "active") {
    throw new ApiError(400, "User is already an active member");
  }

  if (existing) {
    existing.role = role || "member";
    existing.type = type || "member";
    existing.status = "active";
    existing.joinedAt = new Date();
    await existing.save();
    await Organization.findByIdAndUpdate(organizationId, {
      $inc: { memberCount: 1 },
    });
    return existing;
  }

  const membership = await OrgMembership.create({
    organization: organizationId,
    user: userId,
    role: role || "member",
    type: type || "member",
    status: "active",
  });

  await Organization.findByIdAndUpdate(organizationId, {
    $inc: { memberCount: 1 },
  });

  return membership;
};

const listMembers = async (organizationId, { status = "active" } = {}) => {
  return OrgMembership.find({
    organization: organizationId,
    status,
  })
    .populate("user", "displayName username avatarUrl")
    .sort({ joinedAt: -1 });
};

const getMembership = async (organizationId, userId) => {
  return OrgMembership.findOne({
    organization: organizationId,
    user: userId,
  });
};

const changeRole = async (
  organizationId,
  targetUserId,
  newRole,
  actorMembership,
) => {
  const target = await OrgMembership.findOne({
    organization: organizationId,
    user: targetUserId,
    status: "active",
  });

  if (!target) {
    throw new ApiError(404, "Active membership not found");
  }

  if (target.role === "owner") {
    throw new ApiError(403, "Cannot change the role of the organization owner");
  }

  if (
    actorMembership.role !== "owner" &&
    (newRole === "admin" || target.role === "admin")
  ) {
    throw new ApiError(403, "Only the owner can manage admin roles");
  }

  target.role = newRole;
  await target.save();
  return target;
};

const changeType = async (organizationId, targetUserId, newType) => {
  const target = await OrgMembership.findOne({
    organization: organizationId,
    user: targetUserId,
    status: "active",
  });

  if (!target) {
    throw new ApiError(404, "Active membership not found");
  }

  target.type = newType;
  await target.save();
  return target;
};

const changeStatus = async (
  organizationId,
  targetUserId,
  newStatus,
  actorMembership,
) => {
  const target = await OrgMembership.findOne({
    organization: organizationId,
    user: targetUserId,
  });

  if (!target) {
    throw new ApiError(404, "Membership not found");
  }

  if (target.role === "owner") {
    throw new ApiError(
      403,
      "Cannot change the status of the organization owner",
    );
  }

  if (target.user.toString() === actorMembership.user.toString()) {
    throw new ApiError(400, "Cannot change your own status");
  }

  target.status = newStatus;
  await target.save();
  return target;
};

const removeMember = async (organizationId, targetUserId, actorMembership) => {
  const target = await OrgMembership.findOne({
    organization: organizationId,
    user: targetUserId,
  });

  if (!target) {
    throw new ApiError(404, "Membership not found");
  }

  if (target.role === "owner") {
    throw new ApiError(403, "Cannot remove the organization owner");
  }

  if (target.user.toString() === actorMembership.user.toString()) {
    throw new ApiError(400, "Cannot remove yourself");
  }

  target.status = "removed";
  await target.save();

  const orgSpaces = await Space.find({ organization: organizationId }).select(
    "_id",
  );
  const orgSpaceIds = orgSpaces.map((s) => s._id);

  if (orgSpaceIds.length > 0) {
    await SpaceMembership.updateMany(
      {
        user: targetUserId,
        space: { $in: orgSpaceIds },
        status: "active",
      },
      { status: "removed" },
    );
  }

  await Organization.findByIdAndUpdate(organizationId, {
    $inc: { memberCount: -1 },
  });
};

export default {
  addMember,
  listMembers,
  getMembership,
  changeRole,
  changeType,
  changeStatus,
  removeMember,
};
