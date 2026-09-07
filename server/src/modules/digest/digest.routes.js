import express from "express";
import digestController from "./digest.controller.js";
import requireAuth from "../auth/auth.middleware.js";

const router = express.Router();

router.get("/", requireAuth, digestController.getDigest);

export default router;
