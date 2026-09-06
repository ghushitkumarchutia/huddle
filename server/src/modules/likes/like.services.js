const Like = require("./like.model");
const Post = require("../posts/post.model");
const notificationServices = require("../notifications/notification.services");
const { emitLikeCountUpdate } = require("../../sockets/engagement.socket");
const { getIo } = require("../../sockets/socket.server");
const ApiError = require("../../common/utils/apiError");

const likePost = async (userId, postId) => {
  try {
    await Like.create({ user: userId, post: postId });
  } catch (error) {
    if (error.code === 11000) {
      throw new ApiError(400, "You have already liked this post");
    }
    throw error;
  }

  const updatedPost = await Post.findByIdAndUpdate(
    postId,
    { $inc: { likeCount: 1 } },
    { new: true },
  );

  if (!updatedPost) {
    throw new ApiError(404, "Post not found");
  }

  emitLikeCountUpdate(getIo(), postId, updatedPost.likeCount);

  await notificationServices.createNotification(
    updatedPost.author,
    userId,
    "like",
    postId,
  );
};

const unlikePost = async (userId, postId) => {
  const result = await Like.findOneAndDelete({ user: userId, post: postId });

  if (!result) {
    throw new ApiError(404, "You have not liked this post");
  }

  const updatedPost = await Post.findByIdAndUpdate(
    postId,
    { $inc: { likeCount: -1 } },
    { new: true },
  );

  if (!updatedPost) {
    throw new ApiError(404, "Post not found");
  }

  emitLikeCountUpdate(getIo(), postId, updatedPost.likeCount);
};

module.exports = {
  likePost,
  unlikePost,
};
