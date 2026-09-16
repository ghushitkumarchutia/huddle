import organizationServices from "./organization.services.js";
import asyncHandler from "../../common/utils/asyncHandler.js";
import ApiResponse from "../../common/utils/apiResponse.js";

const createOrganization = asyncHandler(async (req, res) => {
  const organization = await organizationServices.createOrganization(
    req.user.id,
    req.body,
  );
  res
    .status(201)
    .json(
      new ApiResponse(201, organization, "Organization created successfully"),
    );
});

const getOrganization = asyncHandler(async (req, res) => {
  const organization = await organizationServices.getOrganization(
    req.params.organizationId,
  );
  res
    .status(200)
    .json(
      new ApiResponse(200, organization, "Organization retrieved successfully"),
    );
});

const listMyOrganizations = asyncHandler(async (req, res) => {
  const organizations = await organizationServices.listUserOrganizations(
    req.user.id,
  );
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        organizations,
        "Organizations retrieved successfully",
      ),
    );
});

const updateOrganization = asyncHandler(async (req, res) => {
  const organization = await organizationServices.updateOrganization(
    req.params.organizationId,
    req.body,
  );
  res
    .status(200)
    .json(
      new ApiResponse(200, organization, "Organization updated successfully"),
    );
});

const deleteOrganization = asyncHandler(async (req, res) => {
  await organizationServices.deleteOrganization(req.params.organizationId);
  res
    .status(200)
    .json(new ApiResponse(200, null, "Organization deleted successfully"));
});

export default {
  createOrganization,
  getOrganization,
  listMyOrganizations,
  updateOrganization,
  deleteOrganization,
};
