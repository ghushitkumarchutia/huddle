import express from "express";
import spaceController from "./space.controller.js";
import requireAuth from "../auth/auth.middleware.js";
import validate from "../../common/middleware/validate.middleware.js";
import { createSpaceSchema, updateSpaceSchema } from "./space.validation.js";
import {
  requireOrgMembership,
  requireOrgPermission,
  requireSpaceMembership,
  requireSpacePermission,
} from "../../common/middleware/authorization.middleware.js";

const router = express.Router();

router.post(
  "/org/:organizationId",
  requireAuth,
  requireOrgMembership(),
  requireOrgPermission("organization.manage_spaces"),
  validate(createSpaceSchema),
  spaceController.createSpace,
);

router.get(
  "/org/:organizationId",
  requireAuth,
  requireOrgMembership(),
  spaceController.listOrgSpaces,
);

router.get("/me", requireAuth, spaceController.listMySpaces);

router.get(
  "/:spaceId",
  requireAuth,
  requireSpaceMembership(),
  spaceController.getSpace,
);

router.patch(
  "/:spaceId",
  requireAuth,
  requireSpaceMembership(),
  requireSpacePermission("space.update"),
  validate(updateSpaceSchema),
  spaceController.updateSpace,
);

router.delete(
  "/:spaceId",
  requireAuth,
  requireSpaceMembership(),
  requireSpacePermission("space.update"),
  spaceController.deleteSpace,
);

export default router;
