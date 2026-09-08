import { z } from "zod";

const createSpaceSchema = {
  body: z.object({
    name: z.string().trim().min(1).max(100),
    description: z.string().trim().max(300).optional(),
  }),
};

const joinSpaceSchema = {
  body: z.object({
    inviteCode: z.string().min(1),
  }),
};

export { createSpaceSchema, joinSpaceSchema };
