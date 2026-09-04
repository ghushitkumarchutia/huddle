const express = require("express");
const spaceController = require("./space.controller");
const requireAuth = require("../auth/auth.middleware");
const validate = require("../../common/middleware/validate.middleware");
const { createSpaceSchema, joinSpaceSchema } = require("./space.validation");

const router = express.Router();

router.post(
  "/",
  requireAuth,
  validate(createSpaceSchema),
  spaceController.createSpace,
);

router.post(
  "/join",
  requireAuth,
  validate(joinSpaceSchema),
  spaceController.joinSpace,
);

router.get("/me", requireAuth, spaceController.listMySpaces);

router.delete(
  "/:spaceId/members/:userId",
  requireAuth,
  spaceController.removeMember,
);

module.exports = router;
