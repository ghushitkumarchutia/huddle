import axiosInstance from "./axiosInstance";

export const followUser = async (followingId, spaceId) => {
  const { data } = await axiosInstance.post(`/follows/${followingId}`, {
    spaceId,
  });
  return data;
};

export const unfollowUser = async (followingId) => {
  const { data } = await axiosInstance.delete(`/follows/${followingId}`);
  return data;
};

export const getFollowers = async (userId) => {
  const { data } = await axiosInstance.get(`/follows/${userId}/followers`);
  return data;
};

export const getFollowing = async (userId) => {
  const { data } = await axiosInstance.get(`/follows/${userId}/following`);
  return data;
};
