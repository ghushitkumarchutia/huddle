import spaceMembershipServices from "./spaceMembership.services.js";
import asyncHandler from "../../common/utils/asyncHandler.js";
import ApiResponse from "../../common/utils/apiResponse.js";

const addMember = asyncHandler(async (req, res) => {
  const { spaceId } = req.params;
  const { userId, role } = req.body;
  const membership = await spaceMembershipServices.addMember(
    spaceId,
    userId,
    role,
  );
  res
    .status(201)
    .json(new ApiResponse(201, membership, "Space member added successfully"));
});

const joinSpace = asyncHandler(async (req, res) => {
  const { inviteCode } = req.body;
  const space = await spaceMembershipServices.joinSpace(
    req.user.id,
    inviteCode,
  );
  res
    .status(200)
    .json(new ApiResponse(200, space, "Joined space successfully"));
});

const listMembers = asyncHandler(async (req, res) => {
  const { spaceId } = req.params;
  const members = await spaceMembershipServices.listMembers(spaceId);
  res
    .status(200)
    .json(
      new ApiResponse(200, members, "Space members retrieved successfully"),
    );
});

const changeRole = asyncHandler(async (req, res) => {
  const { spaceId, userId } = req.params;
  const { role } = req.body;
  const membership = await spaceMembershipServices.changeRole(
    spaceId,
    userId,
    role,
  );
  res
    .status(200)
    .json(new ApiResponse(200, membership, "Space role updated successfully"));
});

const removeMember = asyncHandler(async (req, res) => {
  const { spaceId, userId } = req.params;
  await spaceMembershipServices.removeMember(spaceId, userId, req.user.id);
  res
    .status(200)
    .json(new ApiResponse(200, null, "Space member removed successfully"));
});

export default {
  addMember,
  joinSpace,
  listMembers,
  changeRole,
  removeMember,
};
