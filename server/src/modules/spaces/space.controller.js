const spaceServices = require("./space.services");
const asyncHandler = require("../../common/utils/asyncHandler");
const ApiResponse = require("../../common/utils/apiResponse");

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

module.exports = {
  createSpace,
  joinSpace,
  listMySpaces,
  removeMember,
};
