const notificationServices = require("./notification.services");
const asyncHandler = require("../../common/utils/asyncHandler");
const ApiResponse = require("../../common/utils/apiResponse");

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

module.exports = {
  listNotifications,
  markAsRead,
};
