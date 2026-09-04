const userServices = require("./user.services");
const asyncHandler = require("../../common/utils/asyncHandler");
const ApiResponse = require("../../common/utils/apiResponse");

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

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
};
