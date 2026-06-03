import axiosInstance from "./axiosInstance";

export const createSalonServiceApi = async (serviceData) => {
  const response = await axiosInstance.post("/salon-services", serviceData);
  return response.data;
};

export const getActiveSalonServicesApi = async (salonId) => {
  const response = await axiosInstance.get(`/salon-services/salon/${salonId}`);
  return response.data;
};

export const getMySalonServicesApi = async () => {
  const response = await axiosInstance.get("/salon-services/my-salon");
  return response.data;
};

export const updateSalonServiceApi = async (serviceId, serviceData) => {
  const response = await axiosInstance.put(
    `/salon-services/${serviceId}`,
    serviceData,
  );
  return response.data;
};

export const deleteSalonServiceApi = async (serviceId) => {
  const response = await axiosInstance.delete(`/salon-services/${serviceId}`);
  return response.data;
};
