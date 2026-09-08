import { z } from "zod";

const passwordRule = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[a-zA-Z]/, "Password must contain at least one letter")
  .regex(/[0-9]/, "Password must contain at least one number");

const updateProfileSchema = {
  body: z.object({
    username: z.string().trim().toLowerCase().min(3).max(30).optional(),
    displayName: z.string().trim().max(50).optional(),
    bio: z.string().trim().max(200).optional(),
    avatarUrl: z.string().url().optional(),
  }),
};

const changePasswordSchema = {
  body: z.object({
    currentPassword: z.string().min(1),
    newPassword: passwordRule,
  }),
};

export { updateProfileSchema, changePasswordSchema };
