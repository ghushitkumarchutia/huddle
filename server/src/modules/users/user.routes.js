const express = require("express");
const userController = require("./user.controller");
const validate = require("../../common/middleware/validate.middleware");
const {
  updateProfileSchema,
  changePasswordSchema,
} = require("./user.validation");

const router = express.Router();

const requireAuth = require("../auth/auth.middleware");

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

module.exports = router;
