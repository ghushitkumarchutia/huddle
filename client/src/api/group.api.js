import axiosInstance from "./axiosInstance";

export const createGroup = async (spaceId, name) => {
  const response = await axiosInstance.post(`/groups/${spaceId}`, { name });
  return response.data;
};

export const listGroups = async (spaceId) => {
  const response = await axiosInstance.get(`/groups/${spaceId}`);
  return response.data;
};
