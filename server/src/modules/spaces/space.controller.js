import spaceServices from "./space.services.js";
import asyncHandler from "../../common/utils/asyncHandler.js";
import ApiResponse from "../../common/utils/apiResponse.js";

const createSpace = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const space = await spaceServices.createSpace(req.user.id, name, description);
  res
    .status(201)
    .json(new ApiResponse(201, space, "Space created successfully"));
});

const joinSpace = asyncHandler(async (req, res) => {
  const { inviteCode } = req.body;
  const space = await spaceServices.joinSpace(req.user.id, inviteCode);
  res
    .status(200)
    .json(new ApiResponse(200, space, "Joined space successfully"));
});

const listMySpaces = asyncHandler(async (req, res) => {
  const spaces = await spaceServices.listUserSpaces(req.user.id);
  res
    .status(200)
    .json(new ApiResponse(200, spaces, "Spaces fetched successfully"));
});

const removeMember = asyncHandler(async (req, res) => {
  const { spaceId, userId } = req.params;
  await spaceServices.removeMember(req.user.id, spaceId, userId);
  res
    .status(200)
    .json(new ApiResponse(200, null, "Member removed successfully"));
});

export default {
  createSpace,
  joinSpace,
  listMySpaces,
  removeMember,
};
