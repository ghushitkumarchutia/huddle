import FeedItem from "./feed.model.js";

const getFeed = async (userId, { page = 1, limit = 20, groupId }) => {
  const parsedPage = parseInt(page) || 1;
  const parsedLimit = parseInt(limit) || 20;
  const skip = (parsedPage - 1) * parsedLimit;

  let feedItems = await FeedItem.find({ feedOwner: userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parsedLimit)
    .populate({
      path: "post",
      populate: {
        path: "group space",
        select: "name",
      },
    });

  if (groupId) {
    feedItems = feedItems.filter(
      (item) =>
        item.post &&
        item.post.group &&
        item.post.group._id.toString() === groupId,
    );
  }

  const posts = feedItems.map((item) => item.post).filter(Boolean);

  return {
    posts,
    page: parsedPage,
    limit: parsedLimit,
    hasMore: posts.length === parsedLimit,
  };
};

export default {
  getFeed,
};
