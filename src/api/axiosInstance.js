import axios from "axios";
import { getToken, clearAuthData } from "../utils/tokenStorage";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      // Keep user data available unless you want forced logout:
      // clearAuthData();
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
