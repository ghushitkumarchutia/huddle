import Post from "./post.model.js";
import FeedItem from "../feed/feed.model.js";
import Like from "../likes/like.model.js";
import Comment from "../comments/comment.model.js";
import User from "../users/user.model.js";
import Group from "../groups/group.model.js";
import followServices from "../follows/follow.services.js";
import ApiError from "../../common/utils/apiError.js";

const createPost = async (userId, spaceId, groupId, content, imageUrl) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  const group = await Group.findById(groupId);
  if (!group) throw new ApiError(404, "Group not found");

  const visibility = group.name.toLowerCase().includes("announcement")
    ? "space-wide"
    : "group";

  const authorSnapshot = {
    displayName: user.displayName,
    username: user.username,
    avatarUrl: user.avatarUrl || null,
  };

  const post = await Post.create({
    author: userId,
    authorSnapshot,
    space: spaceId,
    group: groupId,
    content,
    imageUrl,
    visibility,
  });

  const followers = await followServices.listFollowers(userId, spaceId);

  const feedItems = followers
    .filter((f) => f.follower)
    .map((f) => ({
      feedOwner: f.follower._id,
      post: post._id,
      createdAt: post.createdAt,
    }));

  feedItems.push({
    feedOwner: userId,
    post: post._id,
    createdAt: post.createdAt,
  });

  if (feedItems.length > 0) {
    await FeedItem.insertMany(feedItems);
  }

  return post;
};

const updatePost = async (userId, postId, content) => {
  const post = await Post.findById(postId);
  if (!post) throw new ApiError(404, "Post not found");
  if (post.author.toString() !== userId.toString())
    throw new ApiError(403, "Unauthorized to update this post");

  post.content = content;
  await post.save();
  return post;
};

const deletePost = async (userId, postId) => {
  const post = await Post.findById(postId);
  if (!post) throw new ApiError(404, "Post not found");
  if (post.author.toString() !== userId.toString())
    throw new ApiError(403, "Unauthorized to delete this post");

  await Post.findByIdAndDelete(postId);
  await FeedItem.deleteMany({ post: postId });
  await Like.deleteMany({ post: postId });
  await Comment.deleteMany({ post: postId });
};

export default {
  createPost,
  updatePost,
  deletePost,
};
