import axiosInstance from "./axiosInstance";

export const likePost = async (postId) => {
  const { data } = await axiosInstance.post(`/api/likes/${postId}`);
  return data;
};

export const unlikePost = async (postId) => {
  const { data } = await axiosInstance.delete(`/api/likes/${postId}`);
  return data;
};
