import axiosInstance from "./axiosInstance";

export const getProfile = async (userId) => {
  const response = await axiosInstance.get(`/users/${userId}`);
  return response.data;
};

export const updateProfile = async (updates) => {
  const response = await axiosInstance.patch("/users/me", updates);
  return response.data;
};

export const changePassword = async (payload) => {
  const response = await axiosInstance.patch("/users/me/password", payload);
  return response.data;
};

export const deleteAccount = async () => {
  const response = await axiosInstance.delete("/users/me");
  return response.data;
};
