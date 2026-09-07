import express from "express";
import likeController from "./like.controller.js";
import requireAuth from "../auth/auth.middleware.js";

const router = express.Router();

router.post("/:postId", requireAuth, likeController.like);

router.delete("/:postId", requireAuth, likeController.unlike);

export default router;
