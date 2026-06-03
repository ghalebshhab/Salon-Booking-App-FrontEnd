import axiosInstance from "./axiosInstance";

export const createSalonApi = async (data) => {
  const response = await axiosInstance.post("/salons/createSalon", data);
  return response.data;
};

export const getSalonByIdApi = async (salonId) => {
  const response = await axiosInstance.get(`/salons/${salonId}`);
  return response.data;
};

export const getMySalonApi = async () => {
  const response = await axiosInstance.get("/salons/my-salon");
  return response.data;
};

export const updateSalonApi = async (salonId, data) => {
  const response = await axiosInstance.put(
    `/salons/updateSalon/${salonId}`,
    data,
  );
  return response.data;
};

export const deleteSalonApi = async () => {
  const response = await axiosInstance.delete("/salons/deleteSalon");
  return response.data;
};

export const getSalonEmployeesApi = async (salonId) => {
  const response = await axiosInstance.get(`/salons/${salonId}/employees`);
  return response.data;
};
