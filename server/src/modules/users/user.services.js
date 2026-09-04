const User = require("./user.model");
const Space = require("../spaces/space.model");
const {
  hashPassword,
  comparePassword,
} = require("../../common/utils/hash.utils");
const ApiError = require("../../common/utils/apiError");

const getPublicProfile = async (userId) => {
  const user = await User.findById(userId).select("-notificationPreferences");
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return user;
};

const updateProfile = async (userId, updates) => {
  const user = await User.findByIdAndUpdate(userId, updates, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return user;
};

const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId).select("+passwordHash");
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isMatch = await comparePassword(currentPassword, user.passwordHash);
  if (!isMatch) {
    throw new ApiError(400, "Incorrect current password");
  }

  user.passwordHash = await hashPassword(newPassword);
  await user.save();
};

const deleteAccount = async (userId) => {
  const adminSpaces = await Space.findOne({ admin: userId });
  if (adminSpaces) {
    throw new ApiError(
      400,
      "Cannot delete account while you are the admin of a space",
    );
  }

  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.spaces && user.spaces.length > 0) {
    await Space.updateMany(
      { _id: { $in: user.spaces } },
      { $inc: { memberCount: -1 } },
    );
  }
};

module.exports = {
  getPublicProfile,
  updateProfile,
  changePassword,
  deleteAccount,
};
