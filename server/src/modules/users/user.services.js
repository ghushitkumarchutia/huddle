import User from "./user.model.js";
import OrgMembership from "../organizationMemberships/orgMembership.model.js";
import SpaceMembership from "../spaceMemberships/spaceMembership.model.js";
import Space from "../spaces/space.model.js";
import Organization from "../organizations/organization.model.js";
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
  const allowed = {};
  if (updates.displayName !== undefined)
    allowed.displayName = updates.displayName;
  if (updates.bio !== undefined) allowed.bio = updates.bio;
  if (updates.avatarUrl !== undefined) allowed.avatarUrl = updates.avatarUrl;
  if (updates.username !== undefined) allowed.username = updates.username;

  const user = await User.findByIdAndUpdate(userId, allowed, {
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
  const ownedOrgs = await OrgMembership.findOne({
    user: userId,
    role: "owner",
    status: "active",
  });

  if (ownedOrgs) {
    throw new ApiError(
      400,
      "Cannot delete account while you are the owner of an organization. Transfer ownership first.",
    );
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const spaceMemberships = await SpaceMembership.find({ user: userId });
  const memberSpaceIds = spaceMemberships.map((m) => m.space);

  if (memberSpaceIds.length > 0) {
    await Space.updateMany(
      { _id: { $in: memberSpaceIds } },
      { $inc: { memberCount: -1 } },
    );
  }

  const orgMemberships = await OrgMembership.find({
    user: userId,
    status: "active",
  });
  const orgIds = orgMemberships.map((m) => m.organization);

  if (orgIds.length > 0) {
    await Organization.updateMany(
      { _id: { $in: orgIds } },
      { $inc: { memberCount: -1 } },
    );
  }

  await OrgMembership.deleteMany({ user: userId });
  await SpaceMembership.deleteMany({ user: userId });

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

  await User.findByIdAndDelete(userId);
};

export default {
  getPublicProfile,
  updateProfile,
  changePassword,
  deleteAccount,
};
