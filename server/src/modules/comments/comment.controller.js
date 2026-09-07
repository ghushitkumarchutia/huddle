import commentServices from "./comment.services.js";
import asyncHandler from "../../common/utils/asyncHandler.js";
import ApiResponse from "../../common/utils/apiResponse.js";

const addComment = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;
  const comment = await commentServices.addComment(
    req.user.id,
    postId,
    content,
  );
  res
    .status(201)
    .json(new ApiResponse(201, comment, "Successfully added comment"));
});

const listComments = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { page, limit } = req.query;
  const comments = await commentServices.listComments(postId, { page, limit });
  res
    .status(200)
    .json(new ApiResponse(200, comments, "Successfully retrieved comments"));
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  await commentServices.deleteComment(req.user.id, commentId);
  res
    .status(200)
    .json(new ApiResponse(200, null, "Successfully deleted comment"));
});

export default {
  addComment,
  listComments,
  deleteComment,
};
