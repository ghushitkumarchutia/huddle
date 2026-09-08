import User from "./user.model.js";
import Space from "../spaces/space.model.js";
import Follow from "../follows/follow.model.js";
import Post from "../posts/post.model.js";
import FeedItem from "../feed/feed.model.js";
import Like from "../likes/like.model.js";
import Comment from "../comments/comment.model.js";
import Notification from "../notifications/notification.model.js";
import RefreshToken from "../../models/refreshToken.model.js";
import {
  hashPassword,
  comparePassword,
} from "../../common/utils/hash.utils.js";
import ApiError from "../../common/utils/apiError.js";

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

  const userPostIds = (await Post.find({ author: userId }).select("_id")).map(
    (p) => p._id,
  );

  if (userPostIds.length > 0) {
    await FeedItem.deleteMany({ post: { $in: userPostIds } });
    await Like.deleteMany({ post: { $in: userPostIds } });
    await Comment.deleteMany({ post: { $in: userPostIds } });
  }

  await Post.deleteMany({ author: userId });
  await FeedItem.deleteMany({ feedOwner: userId });
  await Follow.deleteMany({
    $or: [{ follower: userId }, { following: userId }],
  });
  await Like.deleteMany({ user: userId });
  await Comment.deleteMany({ author: userId });
  await Notification.deleteMany({
    $or: [{ recipient: userId }, { actor: userId }],
  });
  await RefreshToken.deleteMany({ user: userId });
};

export default {
  getPublicProfile,
  updateProfile,
  changePassword,
  deleteAccount,
};
