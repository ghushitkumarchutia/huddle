import express from "express";
import notificationController from "./notification.controller.js";
import requireAuth from "../auth/auth.middleware.js";

const router = express.Router();

router.get("/", requireAuth, notificationController.listNotifications);

router.patch(
  "/:notificationId/read",
  requireAuth,
  notificationController.markAsRead,
);

export default router;
