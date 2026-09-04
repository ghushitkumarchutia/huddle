import axiosInstance from "./axiosInstance";

export const createSpace = async (payload) => {
  const response = await axiosInstance.post("/spaces", payload);
  return response.data;
};

export const joinSpace = async (payload) => {
  const response = await axiosInstance.post("/spaces/join", payload);
  return response.data;
};

export const listMySpaces = async () => {
  const response = await axiosInstance.get("/spaces/me");
  return response.data;
};

export const removeMember = async (spaceId, userId) => {
  const response = await axiosInstance.delete(
    `/spaces/${spaceId}/members/${userId}`,
  );
  return response.data;
};
