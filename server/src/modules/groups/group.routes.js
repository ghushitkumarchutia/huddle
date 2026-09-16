import express from "express";
import groupController from "./group.controller.js";
import requireAuth from "../auth/auth.middleware.js";
import validate from "../../common/middleware/validate.middleware.js";
import { createGroupSchema } from "./group.validation.js";
import {
  requireSpaceMembership,
  requireSpacePermission,
} from "../../common/middleware/authorization.middleware.js";

const router = express.Router();

router.post(
  "/:spaceId",
  requireAuth,
  requireSpaceMembership(),
  requireSpacePermission("space.manage_groups"),
  validate(createGroupSchema),
  groupController.createGroup,
);

router.get(
  "/:spaceId",
  requireAuth,
  requireSpaceMembership(),
  groupController.listGroups,
);

export default router;
