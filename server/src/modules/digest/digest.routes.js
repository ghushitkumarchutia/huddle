const express = require("express");
const digestController = require("./digest.controller");
const requireAuth = require("../auth/auth.middleware");

const router = express.Router();

router.get("/", requireAuth, digestController.getDigest);

module.exports = router;
