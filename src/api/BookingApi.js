import axiosInstance from "./axiosInstance";

export const createBookingApi = async (bookingData) => {
  const response = await axiosInstance.post("/bookings", bookingData);
  return response.data;
};

export const getMyBookingsApi = async () => {
  const response = await axiosInstance.get("/bookings/my");
  return response.data;
};

export const getMySalonBookingsApi = async () => {
  const response = await axiosInstance.get("/bookings/my-salon");
  return response.data;
};

export const getMySalonPendingBookingsApi = async () => {
  const response = await axiosInstance.get("/bookings/my-salon/pending");
  return response.data;
};

export const acceptBookingApi = async (bookingId, actionData = {}) => {
  const response = await axiosInstance.put(
    `/bookings/${bookingId}/accept`,
    actionData,
  );
  return response.data;
};

export const rejectBookingApi = async (bookingId, actionData = {}) => {
  const response = await axiosInstance.put(
    `/bookings/${bookingId}/reject`,
    actionData,
  );
  return response.data;
};

export const cancelMyBookingApi = async (bookingId) => {
  const response = await axiosInstance.put(`/bookings/${bookingId}/cancel`);
  return response.data;
};

export const completeBookingApi = async (bookingId) => {
  const response = await axiosInstance.put(`/bookings/${bookingId}/complete`);
  return response.data;
};
