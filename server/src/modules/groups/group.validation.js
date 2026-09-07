import { z } from "zod";

const createGroupSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1).max(50),
  }),
});

export { createGroupSchema };
