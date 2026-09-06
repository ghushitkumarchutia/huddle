const express = require("express");
const commentController = require("./comment.controller");
const requireAuth = require("../auth/auth.middleware");

const router = express.Router();

router.post("/:postId", requireAuth, commentController.addComment);

router.get("/:postId", requireAuth, commentController.listComments);

router.delete("/:commentId", requireAuth, commentController.deleteComment);

module.exports = router;
