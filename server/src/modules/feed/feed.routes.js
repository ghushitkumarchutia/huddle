import express from "express";
import feedController from "./feed.controller.js";
import requireAuth from "../auth/auth.middleware.js";

const router = express.Router();

router.get("/", requireAuth, feedController.getFeed);

export default router;
