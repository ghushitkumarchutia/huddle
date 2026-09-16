import mongoose from "mongoose";
import FeedItem from "./feed.model.js";

const getFeed = async (userId, { page = 1, limit = 20, groupId }) => {
  const parsedPage = parseInt(page) || 1;
  const parsedLimit = Math.min(parseInt(limit) || 20, 100);
  const skip = (parsedPage - 1) * parsedLimit;
  const userObjectId = new mongoose.Types.ObjectId(userId);

  const pipeline = [
    { $match: { feedOwner: userObjectId } },
    { $sort: { createdAt: -1 } },
    {
      $lookup: {
        from: "posts",
        localField: "post",
        foreignField: "_id",
        as: "post",
      },
    },
    { $unwind: { path: "$post", preserveNullAndEmptyArrays: false } },
  ];

  if (groupId) {
    pipeline.push({
      $match: { "post.group": new mongoose.Types.ObjectId(groupId) },
    });
  }

  pipeline.push(
    { $skip: skip },
    { $limit: parsedLimit },
    {
      $lookup: {
        from: "groups",
        localField: "post.group",
        foreignField: "_id",
        as: "post.groupDetails",
      },
    },
    {
      $unwind: {
        path: "$post.groupDetails",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "spaces",
        localField: "post.space",
        foreignField: "_id",
        as: "post.spaceDetails",
      },
    },
    {
      $unwind: {
        path: "$post.spaceDetails",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $addFields: {
        "post.group": {
          _id: "$post.groupDetails._id",
          name: "$post.groupDetails.name",
        },
        "post.space": {
          _id: "$post.spaceDetails._id",
          name: "$post.spaceDetails.name",
        },
      },
    },
    {
      $project: {
        "post.groupDetails": 0,
        "post.spaceDetails": 0,
      },
    },
  );

  const feedItems = await FeedItem.aggregate(pipeline);
  const posts = feedItems.map((item) => item.post);

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
