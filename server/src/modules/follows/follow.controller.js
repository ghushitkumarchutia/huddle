import followServices from "./follow.services.js";
import asyncHandler from "../../common/utils/asyncHandler.js";
import ApiResponse from "../../common/utils/apiResponse.js";

const follow = asyncHandler(async (req, res) => {
  const { spaceId, userId: followingId } = req.params;
  const followDocument = await followServices.followUser(
    req.user.id,
    followingId,
    spaceId,
  );
  res
    .status(201)
    .json(new ApiResponse(201, followDocument, "Successfully followed user"));
});

const unfollow = asyncHandler(async (req, res) => {
  const { spaceId, userId: followingId } = req.params;
  await followServices.unfollowUser(req.user.id, followingId, spaceId);
  res
    .status(200)
    .json(new ApiResponse(200, null, "Successfully unfollowed user"));
});

const listFollowers = asyncHandler(async (req, res) => {
  const { spaceId, userId } = req.params;
  const followers = await followServices.listFollowers(userId, spaceId);
  res
    .status(200)
    .json(new ApiResponse(200, followers, "Followers retrieved successfully"));
});

const listFollowing = asyncHandler(async (req, res) => {
  const { spaceId, userId } = req.params;
  const following = await followServices.listFollowing(userId, spaceId);
  res
    .status(200)
    .json(new ApiResponse(200, following, "Following retrieved successfully"));
});

export default {
  follow,
  unfollow,
  listFollowers,
  listFollowing,
};
