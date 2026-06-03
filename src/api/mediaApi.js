import axiosInstance from "./axiosInstance";

export const createMediaPostApi = async (data) => {
  const response = await axiosInstance.post("/salon-media", data);
  return response.data;
};

export const getSalonMediaApi = async (salonId) => {
  const response = await axiosInstance.get(`/salon-media/salon/${salonId}`);
  return response.data;
};

export const getSalonVideosApi = async (salonId) => {
  const response = await axiosInstance.get(
    `/salon-media/salon/${salonId}/videos`,
  );
  return response.data;
};

export const deleteMediaPostApi = async (mediaPostId) => {
  const response = await axiosInstance.delete(`/salon-media/${mediaPostId}`);
  return response.data;
};
