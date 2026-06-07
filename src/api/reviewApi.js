import axiosInstance from "./axiosInstance";

export const createReviewApi = async (reviewData) => {
  const response = await axiosInstance.post("/reviews", reviewData);
  return response.data;
};

export const getSalonReviewsApi = async (salonId) => {
  const response = await axiosInstance.get(`/reviews/salon/${salonId}`);
  return response.data;
};

export const getSalonReviewSummaryApi = async (salonId) => {
  const response = await axiosInstance.get(`/reviews/salon/${salonId}/summary`);
  return response.data;
};

export const getMyReviewsApi = async () => {
  const response = await axiosInstance.get("/reviews/my");
  return response.data;
};

export const deleteMyReviewApi = async (reviewId) => {
  const response = await axiosInstance.delete(`/reviews/${reviewId}`);
  return response.data;
};
