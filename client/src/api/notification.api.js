import axiosInstance from "./axiosInstance";

export const getNotifications = async ({ pageParam = 1, limit = 20 }) => {
  const { data } = await axiosInstance.get("/api/notifications", {
    params: { page: pageParam, limit },
  });
  return data;
};

export const markAsRead = async (notificationId) => {
  const { data } = await axiosInstance.patch(
    `/api/notifications/${notificationId}/read`,
  );
  return data;
};
