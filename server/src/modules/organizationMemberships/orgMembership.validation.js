import { z } from "zod";

const addMemberSchema = {
  body: z.object({
    userId: z.string().min(1),
    role: z.enum(["admin", "moderator", "member"]).optional(),
    type: z
      .enum([
        "student",
        "faculty",
        "staff",
        "employee",
        "manager",
        "authority",
        "alumni",
        "member",
      ])
      .optional(),
  }),
};

const changeRoleSchema = {
  body: z.object({
    role: z.enum(["admin", "moderator", "member"]),
  }),
};

const changeTypeSchema = {
  body: z.object({
    type: z.enum([
      "student",
      "faculty",
      "staff",
      "employee",
      "manager",
      "authority",
      "alumni",
      "member",
    ]),
  }),
};

const changeStatusSchema = {
  body: z.object({
    status: z.enum(["active", "suspended"]),
  }),
};

export {
  addMemberSchema,
  changeRoleSchema,
  changeTypeSchema,
  changeStatusSchema,
};
