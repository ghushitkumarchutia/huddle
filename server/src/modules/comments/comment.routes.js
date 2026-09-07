import express from "express";
import commentController from "./comment.controller.js";
import requireAuth from "../auth/auth.middleware.js";

const router = express.Router();

router.post("/:postId", requireAuth, commentController.addComment);

router.get("/:postId", requireAuth, commentController.listComments);

router.delete("/:commentId", requireAuth, commentController.deleteComment);

export default router;
