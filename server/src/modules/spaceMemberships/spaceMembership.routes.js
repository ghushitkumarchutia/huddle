import express from "express";
import spaceMembershipController from "./spaceMembership.controller.js";
import requireAuth from "../auth/auth.middleware.js";
import validate from "../../common/middleware/validate.middleware.js";
import { z } from "zod";
import {
  addSpaceMemberSchema,
  changeSpaceRoleSchema,
} from "./spaceMembership.validation.js";
import {
  requireSpaceMembership,
  requireSpacePermission,
} from "../../common/middleware/authorization.middleware.js";

const router = express.Router();

const joinSpaceSchema = {
  body: z.object({
    inviteCode: z.string().min(1),
  }),
};

router.post(
  "/join",
  requireAuth,
  validate(joinSpaceSchema),
  spaceMembershipController.joinSpace,
);

router.post(
  "/:spaceId/members",
  requireAuth,
  requireSpaceMembership(),
  requireSpacePermission("space.manage_members"),
  validate(addSpaceMemberSchema),
  spaceMembershipController.addMember,
);

router.get(
  "/:spaceId/members",
  requireAuth,
  requireSpaceMembership(),
  spaceMembershipController.listMembers,
);

router.patch(
  "/:spaceId/members/:userId/role",
  requireAuth,
  requireSpaceMembership(),
  requireSpacePermission("space.manage_members"),
  validate(changeSpaceRoleSchema),
  spaceMembershipController.changeRole,
);

router.delete(
  "/:spaceId/members/:userId",
  requireAuth,
  requireSpaceMembership(),
  requireSpacePermission("space.manage_members"),
  spaceMembershipController.removeMember,
);

export default router;
