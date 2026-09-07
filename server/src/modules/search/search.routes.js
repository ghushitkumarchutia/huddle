const express = require("express");
const searchController = require("./search.controller");
const requireAuth = require("../auth/auth.middleware");

const router = express.Router();

router.get("/:spaceId/members", requireAuth, searchController.searchMembers);

router.get("/:spaceId/posts", requireAuth, searchController.searchPosts);

module.exports = router;
