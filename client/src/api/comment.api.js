import axiosInstance from "./axiosInstance";

export const addComment = async (postId, content) => {
  const { data } = await axiosInstance.post(`/api/comments/${postId}`, {
    content,
  });
  return data;
};

export const getComments = async ({ postId, pageParam = 1, limit = 20 }) => {
  const { data } = await axiosInstance.get(`/api/comments/${postId}`, {
    params: { page: pageParam, limit },
  });
  return data;
};

export const deleteComment = async (commentId) => {
  const { data } = await axiosInstance.delete(`/api/comments/${commentId}`);
  return data;
};
