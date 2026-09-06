const express = require("express");
const likeController = require("./like.controller");
const requireAuth = require("../auth/auth.middleware");

const router = express.Router();

router.post("/:postId", requireAuth, likeController.like);

router.delete("/:postId", requireAuth, likeController.unlike);

module.exports = router;
