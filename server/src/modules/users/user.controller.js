import userServices from "./user.services.js";
import asyncHandler from "../../common/utils/asyncHandler.js";
import ApiResponse from "../../common/utils/apiResponse.js";

const getProfile = asyncHandler(async (req, res) => {
  const user = await userServices.getPublicProfile(req.params.userId);
  res.status(200).json(new ApiResponse(200, user));
});

const updateProfile = asyncHandler(async (req, res) => {
  const user = await userServices.updateProfile(req.user.id, req.body);
  res
    .status(200)
    .json(new ApiResponse(200, user, "Profile updated successfully"));
});

const changePassword = asyncHandler(async (req, res) => {
  await userServices.changePassword(
    req.user.id,
    req.body.currentPassword,
    req.body.newPassword,
  );
  res
    .status(200)
    .json(new ApiResponse(200, null, "Password changed successfully"));
});

const deleteAccount = asyncHandler(async (req, res) => {
  await userServices.deleteAccount(req.user.id);
  res
    .status(200)
    .json(new ApiResponse(200, null, "Account deleted successfully"));
});

export default {
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
};
