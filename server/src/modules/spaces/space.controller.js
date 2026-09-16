import spaceServices from "./space.services.js";
import asyncHandler from "../../common/utils/asyncHandler.js";
import ApiResponse from "../../common/utils/apiResponse.js";

const createSpace = asyncHandler(async (req, res) => {
  const { organizationId } = req.params;
  const { name, description } = req.body;
  const space = await spaceServices.createSpace(
    req.user.id,
    organizationId,
    name,
    description,
  );
  res
    .status(201)
    .json(new ApiResponse(201, space, "Space created successfully"));
});

const listOrgSpaces = asyncHandler(async (req, res) => {
  const { organizationId } = req.params;
  const spaces = await spaceServices.listOrgSpaces(organizationId, req.user.id);
  res
    .status(200)
    .json(new ApiResponse(200, spaces, "Spaces fetched successfully"));
});

const listMySpaces = asyncHandler(async (req, res) => {
  const spaces = await spaceServices.listUserSpaces(req.user.id);
  res
    .status(200)
    .json(new ApiResponse(200, spaces, "Spaces fetched successfully"));
});

const getSpace = asyncHandler(async (req, res) => {
  const space = await spaceServices.getSpace(req.params.spaceId);
  res
    .status(200)
    .json(new ApiResponse(200, space, "Space retrieved successfully"));
});

const updateSpace = asyncHandler(async (req, res) => {
  const space = await spaceServices.updateSpace(req.params.spaceId, req.body);
  res
    .status(200)
    .json(new ApiResponse(200, space, "Space updated successfully"));
});

const deleteSpace = asyncHandler(async (req, res) => {
  await spaceServices.deleteSpace(req.params.spaceId);
  res
    .status(200)
    .json(new ApiResponse(200, null, "Space deleted successfully"));
});

export default {
  createSpace,
  listOrgSpaces,
  listMySpaces,
  getSpace,
  updateSpace,
  deleteSpace,
};
