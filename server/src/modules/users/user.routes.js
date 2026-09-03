const express = require("express");
const userController = require("./user.controller");
const validate = require("../../common/middleware/validate.middleware");
const {
  updateProfileSchema,
  changePasswordSchema,
} = require("./user.validation");

const router = express.Router();

const requireAuthPlaceholder = (req, res, next) => next();

router.get("/:userId", userController.getProfile);

router.patch(
  "/me",
  requireAuthPlaceholder,
  validate(updateProfileSchema),
  userController.updateProfile,
);

router.patch(
  "/me/password",
  requireAuthPlaceholder,
  validate(changePasswordSchema),
  userController.changePassword,
);

router.delete("/me", requireAuthPlaceholder, userController.deleteAccount);

module.exports = router;
