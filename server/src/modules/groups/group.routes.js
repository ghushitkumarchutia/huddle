const express = require("express");
const groupController = require("./group.controller");
const requireAuth = require("../auth/auth.middleware");
const validate = require("../../common/middleware/validate.middleware");
const { createGroupSchema } = require("./group.validation");

const router = express.Router();

router.post(
  "/:spaceId",
  requireAuth,
  validate(createGroupSchema),
  groupController.createGroup,
);

router.get("/:spaceId", requireAuth, groupController.listGroups);

module.exports = router;
