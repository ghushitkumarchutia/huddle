import orgMembershipServices from "./orgMembership.services.js";
import asyncHandler from "../../common/utils/asyncHandler.js";
import ApiResponse from "../../common/utils/apiResponse.js";

const addMember = asyncHandler(async (req, res) => {
  const { organizationId } = req.params;
  const { userId, role, type } = req.body;
  const membership = await orgMembershipServices.addMember(
    organizationId,
    userId,
    role,
    type,
  );
  res
    .status(201)
    .json(new ApiResponse(201, membership, "Member added successfully"));
});

const listMembers = asyncHandler(async (req, res) => {
  const { organizationId } = req.params;
  const { status } = req.query;
  const members = await orgMembershipServices.listMembers(organizationId, {
    status,
  });
  res
    .status(200)
    .json(new ApiResponse(200, members, "Members retrieved successfully"));
});

const changeRole = asyncHandler(async (req, res) => {
  const { organizationId, userId } = req.params;
  const { role } = req.body;
  const membership = await orgMembershipServices.changeRole(
    organizationId,
    userId,
    role,
    req.orgMembership,
  );
  res
    .status(200)
    .json(new ApiResponse(200, membership, "Role updated successfully"));
});

const changeType = asyncHandler(async (req, res) => {
  const { organizationId, userId } = req.params;
  const { type } = req.body;
  const membership = await orgMembershipServices.changeType(
    organizationId,
    userId,
    type,
  );
  res
    .status(200)
    .json(new ApiResponse(200, membership, "Type updated successfully"));
});

const changeStatus = asyncHandler(async (req, res) => {
  const { organizationId, userId } = req.params;
  const { status } = req.body;
  const membership = await orgMembershipServices.changeStatus(
    organizationId,
    userId,
    status,
    req.orgMembership,
  );
  res
    .status(200)
    .json(new ApiResponse(200, membership, "Status updated successfully"));
});

const removeMember = asyncHandler(async (req, res) => {
  const { organizationId, userId } = req.params;
  await orgMembershipServices.removeMember(
    organizationId,
    userId,
    req.orgMembership,
  );
  res
    .status(200)
    .json(new ApiResponse(200, null, "Member removed successfully"));
});

export default {
  addMember,
  listMembers,
  changeRole,
  changeType,
  changeStatus,
  removeMember,
};
