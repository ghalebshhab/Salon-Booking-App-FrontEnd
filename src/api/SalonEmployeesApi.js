import axiosInstance from "./axiosInstance";

export const getMySalonEmployeesApi = async () => {
  const response = await axiosInstance.get("/salon-employees/my-salon");
  return response.data;
};

export const getSalonEmployeesApi = async (salonId) => {
  const response = await axiosInstance.get(`/salon-employees/salon/${salonId}`);
  return response.data;
};

export const addEmployeeToMySalonApi = async (employeeData) => {
  const response = await axiosInstance.post("/salon-employees", employeeData);
  return response.data;
};

export const resendEmployeeInvitationApi = async (employeeId) => {
  const response = await axiosInstance.post(
    `/salon-employees/${employeeId}/resend-invitation`,
  );
  return response.data;
};

export const removeEmployeeApi = async (employeeId) => {
  const response = await axiosInstance.delete(`/salon-employees/${employeeId}`);
  return response.data;
};
