import { z } from "zod";

const passwordRule = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[a-zA-Z]/, "Password must contain at least one letter")
  .regex(/[0-9]/, "Password must contain at least one number");

const signupSchema = z.object({
  body: z.object({
    username: z.string().trim().toLowerCase().min(3).max(30),
    email: z.string().trim().toLowerCase().email(),
    password: passwordRule,
    displayName: z.string().trim().max(50),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().toLowerCase().email(),
    password: z.string().min(1),
  }),
});

const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().trim().toLowerCase().email(),
  }),
});

const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1),
    newPassword: passwordRule,
  }),
});

export { signupSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema };
