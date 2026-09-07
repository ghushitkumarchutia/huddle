const searchServices = require("./search.services");
const asyncHandler = require("../../common/utils/asyncHandler");
const ApiResponse = require("../../common/utils/apiResponse");

const searchMembers = asyncHandler(async (req, res) => {
  const { spaceId } = req.params;
  const { q } = req.query;
  const members = await searchServices.searchMembers(spaceId, q);
  res
    .status(200)
    .json(new ApiResponse(200, members, "Members retrieved successfully"));
});

const searchPosts = asyncHandler(async (req, res) => {
  const { spaceId } = req.params;
  const { groupId, q } = req.query;
  const posts = await searchServices.searchPosts(spaceId, groupId, q);
  res
    .status(200)
    .json(new ApiResponse(200, posts, "Posts retrieved successfully"));
});

module.exports = {
  searchMembers,
  searchPosts,
};
