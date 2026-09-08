import crypto from "crypto";
import Space from "./space.model.js";
import User from "../users/user.model.js";
import {
  getOrSetCache,
  invalidateCache,
} from "../../common/utils/cache.utils.js";
import ApiError from "../../common/utils/apiError.js";

const createSpace = async (adminUserId, name, description) => {
  const inviteCode = crypto.randomBytes(6).toString("hex");

  const space = await Space.create({
    name,
    description,
    inviteCode,
    admin: adminUserId,
    memberCount: 1,
  });

  await User.findByIdAndUpdate(adminUserId, {
    $addToSet: { spaces: space._id },
  });

  await invalidateCache(`spaces:user:${adminUserId}`);

  return space;
};

const joinSpace = async (userId, inviteCode) => {
  const space = await Space.findOne({ inviteCode });

  if (!space) {
    throw new ApiError(404, "Space not found or invalid invite code");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.spaces.some((s) => s.toString() === space._id.toString())) {
    throw new ApiError(400, "User is already a member of this space");
  }

  user.spaces.push(space._id);
  await user.save();

  space.memberCount += 1;
  await space.save();

  await invalidateCache(`spaces:user:${userId}`);

  return space;
};

const listUserSpaces = async (userId) => {
  const cacheKey = `spaces:user:${userId}`;

  const spaces = await getOrSetCache(cacheKey, 300, async () => {
    const user = await User.findById(userId).populate("spaces");
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    return user.spaces;
  });

  return spaces;
};

const removeMember = async (adminUserId, spaceId, targetUserId) => {
  const space = await Space.findById(spaceId);

  if (!space) {
    throw new ApiError(404, "Space not found");
  }

  if (space.admin.toString() !== adminUserId.toString()) {
    throw new ApiError(403, "Only the space admin can remove members");
  }

  if (adminUserId.toString() === targetUserId.toString()) {
    throw new ApiError(400, "Admin cannot remove themselves");
  }

  const targetUser = await User.findById(targetUserId);
  if (!targetUser) {
    throw new ApiError(404, "Target user not found");
  }

  const spaceIndex = targetUser.spaces.findIndex(
    (s) => s.toString() === spaceId.toString(),
  );
  if (spaceIndex === -1) {
    throw new ApiError(400, "Target user is not a member of this space");
  }

  targetUser.spaces.splice(spaceIndex, 1);
  await targetUser.save();

  space.memberCount = Math.max(0, space.memberCount - 1);
  await space.save();

  await invalidateCache(`spaces:user:${targetUserId}`);
};

export default {
  createSpace,
  joinSpace,
  listUserSpaces,
  removeMember,
};
