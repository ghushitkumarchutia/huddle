const feedServices = require("./feed.services");
const asyncHandler = require("../../common/utils/asyncHandler");
const ApiResponse = require("../../common/utils/apiResponse");

const getFeed = asyncHandler(async (req, res) => {
  const { page, limit, groupId } = req.query;
  const feed = await feedServices.getFeed(req.user.id, {
    page,
    limit,
    groupId,
  });
  res
    .status(200)
    .json(new ApiResponse(200, feed, "Feed retrieved successfully"));
});

module.exports = {
  getFeed,
};
