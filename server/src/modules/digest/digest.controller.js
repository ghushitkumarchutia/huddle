const digestServices = require("./digest.services");
const asyncHandler = require("../../common/utils/asyncHandler");
const ApiResponse = require("../../common/utils/apiResponse");

const getDigest = asyncHandler(async (req, res) => {
  const digest = await digestServices.getEngagementDigest(req.user.id);
  res
    .status(200)
    .json(new ApiResponse(200, digest, "Digest retrieved successfully"));
});

module.exports = {
  getDigest,
};
