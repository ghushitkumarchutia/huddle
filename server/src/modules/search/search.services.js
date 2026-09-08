import User from "../users/user.model.js";
import Post from "../posts/post.model.js";

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const searchMembers = async (spaceId, query) => {
  if (!query) return [];

  const regex = new RegExp(escapeRegex(query), "i");

  const members = await User.find({
    spaces: spaceId,
    $or: [{ displayName: { $regex: regex } }, { username: { $regex: regex } }],
  })
    .select("displayName username avatarUrl")
    .limit(50);

  return members;
};

const searchPosts = async (spaceId, groupId, query) => {
  if (!query) return [];

  const regex = new RegExp(escapeRegex(query), "i");

  const queryObj = { space: spaceId, content: { $regex: regex } };
  if (groupId) {
    queryObj.group = groupId;
  }

  const posts = await Post.find(queryObj).sort({ createdAt: -1 }).limit(50);

  return posts;
};

export default {
  searchMembers,
  searchPosts,
};
