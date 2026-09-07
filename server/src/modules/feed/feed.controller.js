import feedServices from "./feed.services.js";
import asyncHandler from "../../common/utils/asyncHandler.js";
import ApiResponse from "../../common/utils/apiResponse.js";

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

export default {
  getFeed,
};
