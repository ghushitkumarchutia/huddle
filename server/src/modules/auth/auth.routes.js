import express from "express";
import authController from "./auth.controller.js";
import validate from "../../common/middleware/validate.middleware.js";
import { strictLimiter } from "../../common/middleware/rateLimiter.middleware.js";
import {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "./auth.validation.js";

const router = express.Router();

router.post(
  "/signup",
  strictLimiter,
  validate(signupSchema),
  authController.signup,
);

router.post(
  "/login",
  strictLimiter,
  validate(loginSchema),
  authController.login,
);

router.post("/logout", authController.logout);

router.post("/refresh", authController.refresh);

router.post(
  "/forgot-password",
  strictLimiter,
  validate(forgotPasswordSchema),
  authController.forgotPassword,
);

router.post(
  "/reset-password",
  validate(resetPasswordSchema),
  authController.resetPassword,
);

export default router;
