import notificationServices from "./notification.services.js";
import asyncHandler from "../../common/utils/asyncHandler.js";
import ApiResponse from "../../common/utils/apiResponse.js";

const listNotifications = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const notifications = await notificationServices.listNotifications(
    req.user.id,
    { page, limit },
  );
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        notifications,
        "Successfully retrieved notifications",
      ),
    );
});

const markAsRead = asyncHandler(async (req, res) => {
  const { notificationId } = req.params;
  const notification = await notificationServices.markAsRead(
    req.user.id,
    notificationId,
  );
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        notification,
        "Successfully marked notification as read",
      ),
    );
});

export default {
  listNotifications,
  markAsRead,
};
