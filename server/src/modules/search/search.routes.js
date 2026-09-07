import express from "express";
import searchController from "./search.controller.js";
import requireAuth from "../auth/auth.middleware.js";

const router = express.Router();

router.get("/:spaceId/members", requireAuth, searchController.searchMembers);

router.get("/:spaceId/posts", requireAuth, searchController.searchPosts);

export default router;
