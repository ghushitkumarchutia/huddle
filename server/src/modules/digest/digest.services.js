const mongoose = require("mongoose");
const Post = require("../posts/post.model");
const { getOrSetCache } = require("../../common/utils/cache.utils");

const getEngagementDigest = async (userId) => {
  const cacheKey = `digest:user:${userId}`;
  const ttl = 3600;

  return await getOrSetCache(cacheKey, ttl, async () => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const pipeline = [
      {
        $match: {
          author: new mongoose.Types.ObjectId(userId),
          createdAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: "$group",
          totalLikes: { $sum: "$likeCount" },
          totalComments: { $sum: "$commentCount" },
          postCount: { $sum: 1 },
        },
      },
      {
        $sort: { totalLikes: -1, totalComments: -1 },
      },
      {
        $limit: 1,
      },
      {
        $lookup: {
          from: "groups",
          localField: "_id",
          foreignField: "_id",
          as: "groupDetails",
        },
      },
      {
        $unwind: {
          path: "$groupDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          groupId: "$_id",
          groupName: "$groupDetails.name",
          totalLikes: 1,
          totalComments: 1,
          postCount: 1,
        },
      },
    ];

    const result = await Post.aggregate(pipeline);

    if (result.length === 0) {
      return {
        groupId: null,
        groupName: null,
        totalLikes: 0,
        totalComments: 0,
        postCount: 0,
        message: "No engagement in the last 7 days",
      };
    }

    return result[0];
  });
};

module.exports = {
  getEngagementDigest,
};
