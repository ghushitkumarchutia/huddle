const express = require("express");
const followController = require("./follow.controller");
const requireAuth = require("../auth/auth.middleware");

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

module.exports = router;
