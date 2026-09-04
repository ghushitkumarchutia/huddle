const Group = require("./group.model");
const {
  getOrSetCache,
  invalidateCache,
} = require("../../common/utils/cache.utils");
const ApiError = require("../../common/utils/apiError");

const createGroup = async (userId, spaceId, name) => {
  const existingGroup = await Group.findOne({ space: spaceId, name });
  if (existingGroup) {
    throw new ApiError(
      400,
      "A group with this name already exists in this space",
    );
  }

  const group = await Group.create({
    name,
    space: spaceId,
    createdBy: userId,
  });

  await invalidateCache(`groups:space:${spaceId}`);

  return group;
};

const listSpaceGroups = async (spaceId) => {
  const cacheKey = `groups:space:${spaceId}`;

  const groups = await getOrSetCache(cacheKey, 300, async () => {
    return Group.find({ space: spaceId }).sort({ createdAt: -1 });
  });

  return groups;
};

module.exports = {
  createGroup,
  listSpaceGroups,
};
