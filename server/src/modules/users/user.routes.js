import express from "express";
import userController from "./user.controller.js";
import validate from "../../common/middleware/validate.middleware.js";
import {
  updateProfileSchema,
  changePasswordSchema,
} from "./user.validation.js";
import requireAuth from "../auth/auth.middleware.js";

const router = express.Router();

router.get("/:userId", userController.getProfile);

router.patch(
  "/me",
  requireAuth,
  validate(updateProfileSchema),
  userController.updateProfile,
);

router.patch(
  "/me/password",
  requireAuth,
  validate(changePasswordSchema),
  userController.changePassword,
);

router.delete("/me", requireAuth, userController.deleteAccount);

export default router;
