const groupServices = require("./group.services");
const asyncHandler = require("../../common/utils/asyncHandler");
const ApiResponse = require("../../common/utils/apiResponse");

const createGroup = asyncHandler(async (req, res) => {
  const { spaceId } = req.params;
  const { name } = req.body;
  const group = await groupServices.createGroup(req.user.id, spaceId, name);
  res
    .status(201)
    .json(new ApiResponse(201, group, "Group created successfully"));
});

const listGroups = asyncHandler(async (req, res) => {
  const { spaceId } = req.params;
  const groups = await groupServices.listSpaceGroups(spaceId);
  res
    .status(200)
    .json(new ApiResponse(200, groups, "Groups fetched successfully"));
});

module.exports = {
  createGroup,
  listGroups,
};
