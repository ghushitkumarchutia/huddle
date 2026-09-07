import Follow from "./follow.model.js";
import notificationServices from "../notifications/notification.services.js";
import ApiError from "../../common/utils/apiError.js";

const followUser = async (followerId, followingId, spaceId) => {
  if (followerId.toString() === followingId.toString()) {
    throw new ApiError(400, "You cannot follow yourself");
  }

  try {
    const follow = await Follow.create({
      follower: followerId,
      following: followingId,
      space: spaceId,
    });

    await notificationServices.createNotification(
      followingId,
      followerId,
      "follow",
    );

    return follow;
  } catch (error) {
    if (error.code === 11000) {
      throw new ApiError(
        400,
        "You are already following this user in this space",
      );
    }
    throw error;
  }
};

const unfollowUser = async (followerId, followingId, spaceId) => {
  const result = await Follow.findOneAndDelete({
    follower: followerId,
    following: followingId,
    space: spaceId,
  });

  if (!result) {
    throw new ApiError(404, "You are not following this user in this space");
  }
};

const listFollowers = async (userId, spaceId) => {
  return Follow.find({ following: userId, space: spaceId })
    .populate("follower", "firstName lastName avatar")
    .sort({ createdAt: -1 });
};

const listFollowing = async (userId, spaceId) => {
  return Follow.find({ follower: userId, space: spaceId })
    .populate("following", "firstName lastName avatar")
    .sort({ createdAt: -1 });
};

const isFollowing = async (followerId, followingId, spaceId) => {
  const follow = await Follow.findOne({
    follower: followerId,
    following: followingId,
    space: spaceId,
  });
  return !!follow;
};

export default {
  followUser,
  unfollowUser,
  listFollowers,
  listFollowing,
  isFollowing,
};
