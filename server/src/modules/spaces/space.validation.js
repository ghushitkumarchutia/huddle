import { z } from "zod";

const createSpaceSchema = {
  body: z.object({
    name: z.string().trim().min(1).max(100),
    description: z.string().trim().max(300).optional(),
  }),
};

const updateSpaceSchema = {
  body: z.object({
    name: z.string().trim().min(1).max(100).optional(),
    description: z.string().trim().max(300).optional(),
  }),
};

export { createSpaceSchema, updateSpaceSchema };
