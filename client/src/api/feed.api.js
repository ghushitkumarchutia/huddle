import axiosInstance from "./axiosInstance";

export const getFeed = async ({ pageParam = 1, limit = 20, groupId }) => {
  const params = { page: pageParam, limit };
  if (groupId) params.groupId = groupId;
  const { data } = await axiosInstance.get("/api/feed", { params });
  return data;
};
