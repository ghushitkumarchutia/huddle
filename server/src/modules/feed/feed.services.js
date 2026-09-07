import FeedItem from "./feed.model.js";

const getFeed = async (userId, { page = 1, limit = 20, groupId }) => {
  const skip = (page - 1) * limit;

  const query = { feedOwner: userId };

  let feedItemsQuery = FeedItem.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate({
      path: "post",
      populate: {
        path: "group space",
        select: "name",
      },
    });

  let feedItems = await feedItemsQuery;

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
    page: parseInt(page),
    limit: parseInt(limit),
    hasMore: feedItems.length === limit,
  };
};

export default {
  getFeed,
};
