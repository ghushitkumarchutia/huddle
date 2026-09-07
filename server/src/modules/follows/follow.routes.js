import express from "express";
import followController from "./follow.controller.js";
import requireAuth from "../auth/auth.middleware.js";

const router = express.Router();

router.post("/:spaceId/:userId", requireAuth, followController.follow);

router.delete("/:spaceId/:userId", requireAuth, followController.unfollow);

router.get(
  "/:spaceId/:userId/followers",
  requireAuth,
  followController.listFollowers,
);

router.get(
  "/:spaceId/:userId/following",
  requireAuth,
  followController.listFollowing,
);

export default router;
