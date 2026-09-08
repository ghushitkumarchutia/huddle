import { CONSTANTS } from "./constants";

export const validatePostContent = (content) => {
  if (!content || content.trim().length === 0) return "Content is required";
  if (content.length > CONSTANTS.POST_MAX_LENGTH)
    return `Content exceeds maximum length of ${CONSTANTS.POST_MAX_LENGTH}`;
  return null;
};

export const validateCommentContent = (content) => {
  if (!content || content.trim().length === 0) return "Content is required";
  if (content.length > CONSTANTS.COMMENT_MAX_LENGTH)
    return `Content exceeds maximum length of ${CONSTANTS.COMMENT_MAX_LENGTH}`;
  return null;
};
