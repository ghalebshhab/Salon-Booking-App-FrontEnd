import api from "./api";

export const createSalonService = async (serviceData) => {
  const response = await api.post("/salon-services", serviceData);
  return response.data;
};

export const getSalonServices = async (salonId) => {
  const response = await api.get(`/salon-services/salon/${salonId}`);
  return response.data;
};

export const getMySalonServices = async () => {
  const response = await api.get("/salon-services/my-salon");
  return response.data;
};

export const updateSalonService = async (serviceId, serviceData) => {
  const response = await api.put(`/salon-services/${serviceId}`, serviceData);
  return response.data;
};

export const deleteSalonService = async (serviceId) => {
  const response = await api.delete(`/salon-services/${serviceId}`);
  return response.data;
};
