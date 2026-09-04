import axiosInstance from "./axiosInstance";

export const signup = async (payload) => {
  const response = await axiosInstance.post("/auth/signup", payload);
  return response.data;
};

export const login = async (payload) => {
  const response = await axiosInstance.post("/auth/login", payload);
  return response.data;
};

export const logout = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};

export const refresh = async () => {
  const response = await axiosInstance.post("/auth/refresh");
  return response.data;
};

export const forgotPassword = async (payload) => {
  const response = await axiosInstance.post("/auth/forgot-password", payload);
  return response.data;
};

export const resetPassword = async (payload) => {
  const response = await axiosInstance.post("/auth/reset-password", payload);
  return response.data;
};
