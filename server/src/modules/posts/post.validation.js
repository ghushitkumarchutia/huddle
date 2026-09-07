import Joi from "joi";

const createPostSchema = Joi.object({
  content: Joi.string().trim().max(2000).required(),
  groupId: Joi.string().hex().length(24).required(),
  spaceId: Joi.string().hex().length(24).required(),
});

const updatePostSchema = Joi.object({
  content: Joi.string().trim().max(2000).required(),
});

export { createPostSchema, updatePostSchema };
