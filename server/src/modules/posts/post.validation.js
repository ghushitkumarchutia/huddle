import { z } from "zod";

const createPostSchema = {
  body: z.object({
    groupId: z.string().min(1),
    content: z.string().trim().min(1).max(2000),
  }),
};

const updatePostSchema = {
  body: z.object({
    content: z.string().trim().min(1).max(2000),
  }),
};

export { createPostSchema, updatePostSchema };
