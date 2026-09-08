import axiosInstance from "./axiosInstance";

export const searchMembers = async (spaceId, query) => {
  const { data } = await axiosInstance.get(`/api/search/${spaceId}/members`, {
    params: { q: query },
  });
  return data;
};

export const searchPosts = async (spaceId, groupId, query) => {
  const params = { q: query };
  if (groupId) params.groupId = groupId;
  const { data } = await axiosInstance.get(`/api/search/${spaceId}/posts`, {
    params,
  });
  return data;
};
