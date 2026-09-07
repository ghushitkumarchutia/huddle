import express from "express";
import groupController from "./group.controller.js";
import requireAuth from "../auth/auth.middleware.js";
import validate from "../../common/middleware/validate.middleware.js";
import { createGroupSchema } from "./group.validation.js";

const router = express.Router();

router.post(
  "/:spaceId",
  requireAuth,
  validate(createGroupSchema),
  groupController.createGroup,
);

router.get("/:spaceId", requireAuth, groupController.listGroups);

export default router;
