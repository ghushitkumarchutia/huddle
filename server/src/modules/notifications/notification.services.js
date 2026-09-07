import Notification from "./notification.model.js";
import User from "../users/user.model.js";
import ApiError from "../../common/utils/apiError.js";

const createNotification = async (
  recipientId,
  actorId,
  type,
  postId = null,
) => {
  if (recipientId.toString() === actorId.toString()) {
    return null;
  }

  const recipient = await User.findById(recipientId);
  if (!recipient) {
    return null;
  }

  const prefs = recipient.notificationPreferences;
  let shouldCreate = false;

  if (type === "like" && prefs?.likes !== false) shouldCreate = true;
  if (type === "comment" && prefs?.comments !== false) shouldCreate = true;
  if (type === "follow" && prefs?.follows !== false) shouldCreate = true;

  if (!shouldCreate) {
    return null;
  }

  const notification = await Notification.create({
    recipient: recipientId,
    actor: actorId,
    type,
    post: postId,
  });

  return notification;
};

const listNotifications = async (userId, { page = 1, limit = 20 }) => {
  const skip = (page - 1) * limit;

  const notifications = await Notification.find({ recipient: userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .populate("actor", "displayName username avatarUrl");

  return notifications;
};

const markAsRead = async (userId, notificationId) => {
  const notification = await Notification.findById(notificationId);
  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }

  if (notification.recipient.toString() !== userId.toString()) {
    throw new ApiError(403, "Unauthorized to update this notification");
  }

  notification.isRead = true;
  await notification.save();
  return notification;
};

export default {
  createNotification,
  listNotifications,
  markAsRead,
};
