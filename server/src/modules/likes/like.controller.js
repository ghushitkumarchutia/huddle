const likeServices = require("./like.services");
const asyncHandler = require("../../common/utils/asyncHandler");
const ApiResponse = require("../../common/utils/apiResponse");

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

module.exports = {
  like,
  unlike,
};
