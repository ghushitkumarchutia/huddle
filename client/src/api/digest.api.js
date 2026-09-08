import axiosInstance from "./axiosInstance";

export const getDigest = async () => {
  const { data } = await axiosInstance.get("/api/digest");
  return data;
};
