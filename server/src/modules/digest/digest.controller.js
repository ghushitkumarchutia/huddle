import digestServices from "./digest.services.js";
import asyncHandler from "../../common/utils/asyncHandler.js";
import ApiResponse from "../../common/utils/apiResponse.js";

const getDigest = asyncHandler(async (req, res) => {
  const digest = await digestServices.getEngagementDigest(req.user.id);
  res
    .status(200)
    .json(new ApiResponse(200, digest, "Digest retrieved successfully"));
});

export default {
  getDigest,
};
