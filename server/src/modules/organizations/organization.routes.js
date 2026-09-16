import express from "express";
import organizationController from "./organization.controller.js";
import requireAuth from "../auth/auth.middleware.js";
import validate from "../../common/middleware/validate.middleware.js";
import {
  createOrganizationSchema,
  updateOrganizationSchema,
} from "./organization.validation.js";
import {
  requireOrgMembership,
  requireOrgPermission,
} from "../../common/middleware/authorization.middleware.js";

const router = express.Router();

router.post(
  "/",
  requireAuth,
  validate(createOrganizationSchema),
  organizationController.createOrganization,
);

router.get("/me", requireAuth, organizationController.listMyOrganizations);

router.get(
  "/:organizationId",
  requireAuth,
  requireOrgMembership(),
  organizationController.getOrganization,
);

router.patch(
  "/:organizationId",
  requireAuth,
  requireOrgMembership(),
  requireOrgPermission("organization.update"),
  validate(updateOrganizationSchema),
  organizationController.updateOrganization,
);

router.delete(
  "/:organizationId",
  requireAuth,
  requireOrgMembership(),
  requireOrgPermission("organization.delete"),
  organizationController.deleteOrganization,
);

export default router;
