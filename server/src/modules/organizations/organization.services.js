import Organization from "./organization.model.js";
import OrgMembership from "../organizationMemberships/orgMembership.model.js";
import SpaceMembership from "../spaceMemberships/spaceMembership.model.js";
import Space from "../spaces/space.model.js";
import Post from "../posts/post.model.js";
import FeedItem from "../feed/feed.model.js";
import Follow from "../follows/follow.model.js";
import Like from "../likes/like.model.js";
import Comment from "../comments/comment.model.js";
import Group from "../groups/group.model.js";
import ApiError from "../../common/utils/apiError.js";

const createOrganization = async (userId, data) => {
  const existingSlug = await Organization.findOne({ slug: data.slug });
  if (existingSlug) {
    throw new ApiError(400, "An organization with this slug already exists");
  }

  const organization = await Organization.create({
    name: data.name,
    slug: data.slug,
    description: data.description,
    type: data.type,
    joinPolicy: data.joinPolicy,
    createdBy: userId,
    memberCount: 1,
  });

  await OrgMembership.create({
    organization: organization._id,
    user: userId,
    role: "owner",
    type: "member",
    status: "active",
  });

  return organization;
};

const getOrganization = async (organizationId) => {
  const organization = await Organization.findById(organizationId);
  if (!organization) {
    throw new ApiError(404, "Organization not found");
  }
  return organization;
};

const listUserOrganizations = async (userId) => {
  const memberships = await OrgMembership.find({
    user: userId,
    status: "active",
  }).populate("organization");

  return memberships.map((m) => ({
    organization: m.organization,
    role: m.role,
    type: m.type,
  }));
};

const updateOrganization = async (organizationId, updates) => {
  const allowed = {};
  if (updates.name !== undefined) allowed.name = updates.name;
  if (updates.description !== undefined)
    allowed.description = updates.description;
  if (updates.type !== undefined) allowed.type = updates.type;
  if (updates.joinPolicy !== undefined) allowed.joinPolicy = updates.joinPolicy;
  if (updates.logoUrl !== undefined) allowed.logoUrl = updates.logoUrl;

  const organization = await Organization.findByIdAndUpdate(
    organizationId,
    allowed,
    { new: true, runValidators: true },
  );

  if (!organization) {
    throw new ApiError(404, "Organization not found");
  }

  return organization;
};

const deleteOrganization = async (organizationId) => {
  const organization = await Organization.findById(organizationId);
  if (!organization) {
    throw new ApiError(404, "Organization not found");
  }

  const spaces = await Space.find({ organization: organizationId });
  const spaceIds = spaces.map((s) => s._id);

  if (spaceIds.length > 0) {
    const postIds = (
      await Post.find({ space: { $in: spaceIds } }).select("_id")
    ).map((p) => p._id);

    if (postIds.length > 0) {
      await FeedItem.deleteMany({ post: { $in: postIds } });
      await Like.deleteMany({ post: { $in: postIds } });
      await Comment.deleteMany({ post: { $in: postIds } });
    }

    await Post.deleteMany({ space: { $in: spaceIds } });
    await Follow.deleteMany({ space: { $in: spaceIds } });
    await Group.deleteMany({ space: { $in: spaceIds } });
    await SpaceMembership.deleteMany({ space: { $in: spaceIds } });
    await Space.deleteMany({ organization: organizationId });
  }

  await OrgMembership.deleteMany({ organization: organizationId });
  await Organization.findByIdAndDelete(organizationId);
};

export default {
  createOrganization,
  getOrganization,
  listUserOrganizations,
  updateOrganization,
  deleteOrganization,
};
