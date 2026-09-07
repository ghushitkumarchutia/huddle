import { z } from "zod";

const createSpaceSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1).max(100),
    description: z.string().trim().max(300).optional(),
  }),
});

const joinSpaceSchema = z.object({
  body: z.object({
    inviteCode: z.string().min(1),
  }),
});

export { createSpaceSchema, joinSpaceSchema };
