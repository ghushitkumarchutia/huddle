import likeServices from "./like.services.js";
import asyncHandler from "../../common/utils/asyncHandler.js";
import ApiResponse from "../../common/utils/apiResponse.js";

const like = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  await likeServices.likePost(req.user.id, postId);
  res.status(200).json(new ApiResponse(200, null, "Successfully liked post"));
});

const unlike = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  await likeServices.unlikePost(req.user.id, postId);
  res.status(200).json(new ApiResponse(200, null, "Successfully unliked post"));
});

export default {
  like,
  unlike,
};
