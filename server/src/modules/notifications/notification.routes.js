const express = require("express");
const notificationController = require("./notification.controller");
const requireAuth = require("../auth/auth.middleware");

const router = express.Router();

router.get("/", requireAuth, notificationController.listNotifications);

router.patch(
  "/:notificationId/read",
  requireAuth,
  notificationController.markAsRead,
);

module.exports = router;
