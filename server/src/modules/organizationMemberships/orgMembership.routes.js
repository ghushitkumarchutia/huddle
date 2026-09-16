import express from "express";
import orgMembershipController from "./orgMembership.controller.js";
import requireAuth from "../auth/auth.middleware.js";
import validate from "../../common/middleware/validate.middleware.js";
import {
  addMemberSchema,
  changeRoleSchema,
  changeTypeSchema,
  changeStatusSchema,
} from "./orgMembership.validation.js";
import {
  requireOrgMembership,
  requireOrgPermission,
} from "../../common/middleware/authorization.middleware.js";

const router = express.Router();

router.post(
  "/:organizationId/members",
  requireAuth,
  requireOrgMembership(),
  requireOrgPermission("organization.manage_members"),
  validate(addMemberSchema),
  orgMembershipController.addMember,
);

router.get(
  "/:organizationId/members",
  requireAuth,
  requireOrgMembership(),
  orgMembershipController.listMembers,
);

router.patch(
  "/:organizationId/members/:userId/role",
  requireAuth,
  requireOrgMembership(),
  requireOrgPermission("organization.manage_roles"),
  validate(changeRoleSchema),
  orgMembershipController.changeRole,
);

router.patch(
  "/:organizationId/members/:userId/type",
  requireAuth,
  requireOrgMembership(),
  requireOrgPermission("organization.manage_members"),
  validate(changeTypeSchema),
  orgMembershipController.changeType,
);

router.patch(
  "/:organizationId/members/:userId/status",
  requireAuth,
  requireOrgMembership(),
  requireOrgPermission("organization.manage_members"),
  validate(changeStatusSchema),
  orgMembershipController.changeStatus,
);

router.delete(
  "/:organizationId/members/:userId",
  requireAuth,
  requireOrgMembership(),
  requireOrgPermission("organization.manage_members"),
  orgMembershipController.removeMember,
);

export default router;
