import express from "express";
import spaceController from "./space.controller.js";
import requireAuth from "../auth/auth.middleware.js";
import validate from "../../common/middleware/validate.middleware.js";
import { createSpaceSchema, joinSpaceSchema } from "./space.validation.js";

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

export default router;
