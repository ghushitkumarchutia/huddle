const express = require("express");
const feedController = require("./feed.controller");
const requireAuth = require("../auth/auth.middleware");

const router = express.Router();

router.get("/", requireAuth, feedController.getFeed);

module.exports = router;
