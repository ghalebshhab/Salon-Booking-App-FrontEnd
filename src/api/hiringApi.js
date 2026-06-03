import axiosInstance from "./axiosInstance";

export const createHiringPostApi = async (data) => {
  const response = await axiosInstance.post("/hiring-posts", data);
  return response.data;
};

export const getOpenHiringPostsApi = async () => {
  const response = await axiosInstance.get("/hiring-posts/open");
  return response.data;
};

export const joinHiringPostApi = async (postId) => {
  const response = await axiosInstance.post(`/hiring-posts/${postId}/join`);
  return response.data;
};

export const closeHiringPostApi = async (postId) => {
  const response = await axiosInstance.put(`/hiring-posts/${postId}/close`);
  return response.data;
};
