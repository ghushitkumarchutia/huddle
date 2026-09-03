const express = require("express");
const authController = require("./auth.controller");
const validate = require("../../common/middleware/validate.middleware");
const {
  strictLimiter,
} = require("../../common/middleware/rateLimiter.middleware");
const {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} = require("./auth.validation");

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

module.exports = router;
