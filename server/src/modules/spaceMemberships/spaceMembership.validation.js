import { z } from "zod";

const addSpaceMemberSchema = {
  body: z.object({
    userId: z.string().min(1),
    role: z.enum(["space_admin", "moderator", "member"]).optional(),
  }),
};

const changeSpaceRoleSchema = {
  body: z.object({
    role: z.enum(["space_admin", "moderator", "member"]),
  }),
};

export { addSpaceMemberSchema, changeSpaceRoleSchema };
