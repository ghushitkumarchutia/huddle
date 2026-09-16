import crypto from "crypto";
import Space from "./space.model.js";
import SpaceMembership from "../spaceMemberships/spaceMembership.model.js";
import Post from "../posts/post.model.js";
import FeedItem from "../feed/feed.model.js";
import Follow from "../follows/follow.model.js";
import Like from "../likes/like.model.js";
import Comment from "../comments/comment.model.js";
import Group from "../groups/group.model.js";
import {
  getOrSetCache,
  invalidateCache,
} from "../../common/utils/cache.utils.js";
import ApiError from "../../common/utils/apiError.js";

const createSpace = async (userId, organizationId, name, description) => {
  const inviteCode = crypto.randomBytes(6).toString("hex");

  const space = await Space.create({
    organization: organizationId,
    name,
    description,
    inviteCode,
    createdBy: userId,
    memberCount: 1,
  });

  await SpaceMembership.create({
    space: space._id,
    user: userId,
    role: "space_admin",
    status: "active",
  });

  await invalidateCache(`spaces:org:${organizationId}`);

  return space;
};

const listOrgSpaces = async (organizationId, userId) => {
  const cacheKey = `spaces:org:${organizationId}:user:${userId}`;

  const spaces = await getOrSetCache(cacheKey, 300, async () => {
    const memberships = await SpaceMembership.find({
      user: userId,
      status: "active",
    }).select("space");

    const memberSpaceIds = memberships.map((m) => m.space);

    return Space.find({
      organization: organizationId,
      _id: { $in: memberSpaceIds },
    }).sort({ createdAt: -1 });
  });

  return spaces;
};

const listUserSpaces = async (userId) => {
  const cacheKey = `spaces:user:${userId}`;

  const spaces = await getOrSetCache(cacheKey, 300, async () => {
    const memberships = await SpaceMembership.find({
      user: userId,
      status: "active",
    })
      .select("space")
      .populate({
        path: "space",
        populate: { path: "organization", select: "name slug" },
      });

    return memberships.map((m) => m.space).filter(Boolean);
  });

  return spaces;
};

const getSpace = async (spaceId) => {
  const space = await Space.findById(spaceId);
  if (!space) {
    throw new ApiError(404, "Space not found");
  }
  return space;
};

const updateSpace = async (spaceId, updates) => {
  const allowed = {};
  if (updates.name !== undefined) allowed.name = updates.name;
  if (updates.description !== undefined)
    allowed.description = updates.description;

  const space = await Space.findByIdAndUpdate(spaceId, allowed, {
    new: true,
    runValidators: true,
  });

  if (!space) {
    throw new ApiError(404, "Space not found");
  }

  await invalidateCache(`spaces:org:${space.organization}`);
  return space;
};

const deleteSpace = async (spaceId) => {
  const space = await Space.findById(spaceId);
  if (!space) {
    throw new ApiError(404, "Space not found");
  }

  const postIds = (await Post.find({ space: spaceId }).select("_id")).map(
    (p) => p._id,
  );

  if (postIds.length > 0) {
    await FeedItem.deleteMany({ post: { $in: postIds } });
    await Like.deleteMany({ post: { $in: postIds } });
    await Comment.deleteMany({ post: { $in: postIds } });
  }

  await Post.deleteMany({ space: spaceId });
  await Follow.deleteMany({ space: spaceId });
  await Group.deleteMany({ space: spaceId });
  await SpaceMembership.deleteMany({ space: spaceId });
  await Space.findByIdAndDelete(spaceId);

  await invalidateCache(`spaces:org:${space.organization}`);
};

export default {
  createSpace,
  listOrgSpaces,
  listUserSpaces,
  getSpace,
  updateSpace,
  deleteSpace,
};
