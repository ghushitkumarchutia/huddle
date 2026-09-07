import groupServices from "./group.services.js";
import asyncHandler from "../../common/utils/asyncHandler.js";
import ApiResponse from "../../common/utils/apiResponse.js";

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

export default {
  createGroup,
  listGroups,
};
