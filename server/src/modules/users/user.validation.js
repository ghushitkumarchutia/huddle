const { z } = require("zod");

const updateProfileSchema = z.object({
  body: z.object({
    username: z.string().trim().toLowerCase().min(3).max(30).optional(),
    displayName: z.string().trim().max(50).optional(),
    bio: z.string().trim().max(200).optional(),
    avatarUrl: z.string().url().optional(),
  }),
});

const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(1),
  }),
});

module.exports = {
  updateProfileSchema,
  changePasswordSchema,
};
