import axiosInstance from "./axiosInstance";

export const getDigest = async () => {
  const { data } = await axiosInstance.get("/digest");
  return data;
};
