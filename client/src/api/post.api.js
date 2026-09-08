import axiosInstance from "./axiosInstance";

export const createPost = async (formData) => {
  const { data } = await axiosInstance.post("/posts", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const updatePost = async (postId, content) => {
  const { data } = await axiosInstance.patch(`/posts/${postId}`, {
    content,
  });
  return data;
};

export const deletePost = async (postId) => {
  const { data } = await axiosInstance.delete(`/posts/${postId}`);
  return data;
};
