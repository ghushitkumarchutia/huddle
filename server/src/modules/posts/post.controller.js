const postServices = require("./post.services");
const asyncHandler = require("../../common/utils/asyncHandler");
const ApiResponse = require("../../common/utils/apiResponse");

const createPost = asyncHandler(async (req, res) => {
  const { spaceId, groupId, content } = req.body;
  let imageUrl = null;
  if (req.file) {
    imageUrl = "cloud_media_url_placeholder";
  }
  const post = await postServices.createPost(
    req.user.id,
    spaceId,
    groupId,
    content,
    imageUrl,
  );
  res.status(201).json(new ApiResponse(201, post, "Post created successfully"));
});

const updatePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;
  const post = await postServices.updatePost(req.user.id, postId, content);
  res.status(200).json(new ApiResponse(200, post, "Post updated successfully"));
});

const deletePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  await postServices.deletePost(req.user.id, postId);
  res.status(200).json(new ApiResponse(200, null, "Post deleted successfully"));
});

module.exports = {
  createPost,
  updatePost,
  deletePost,
};
