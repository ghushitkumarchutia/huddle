import Comment from "./comment.model.js";
import Post from "../posts/post.model.js";
import User from "../users/user.model.js";
import notificationServices from "../notifications/notification.services.js";
import { emitCommentCountUpdate } from "../../sockets/engagement.socket.js";
import { getIo } from "../../sockets/socket.server.js";
import ApiError from "../../common/utils/apiError.js";

const addComment = async (userId, postId, content) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  const authorSnapshot = {
    displayName: user.firstName + " " + user.lastName,
    username: user.email.split("@")[0],
    avatarUrl: user.avatar || null,
  };

  const comment = await Comment.create({
    post: postId,
    author: userId,
    authorSnapshot,
    content,
  });

  const updatedPost = await Post.findByIdAndUpdate(
    postId,
    { $inc: { commentCount: 1 } },
    { new: true },
  );

  if (!updatedPost) {
    throw new ApiError(404, "Post not found");
  }

  emitCommentCountUpdate(getIo(), postId, updatedPost.commentCount);

  await notificationServices.createNotification(
    updatedPost.author,
    userId,
    "comment",
    postId,
  );

  return comment;
};

const listComments = async (postId, { page = 1, limit = 20 }) => {
  const skip = (page - 1) * limit;

  const comments = await Comment.find({ post: postId })
    .sort({ createdAt: 1 })
    .skip(skip)
    .limit(parseInt(limit));

  return comments;
};

const deleteComment = async (userId, commentId) => {
  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  if (comment.author.toString() !== userId.toString()) {
    throw new ApiError(403, "Unauthorized to delete this comment");
  }

  await Comment.findByIdAndDelete(commentId);

  const updatedPost = await Post.findByIdAndUpdate(
    comment.post,
    { $inc: { commentCount: -1 } },
    { new: true },
  );

  if (updatedPost) {
    emitCommentCountUpdate(getIo(), comment.post, updatedPost.commentCount);
  }
};

export default {
  addComment,
  listComments,
  deleteComment,
};
