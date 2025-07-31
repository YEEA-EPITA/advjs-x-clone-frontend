import axios from "axios";

export const xcloneApi = axios.create({
    baseURL: "http://localhost:8080",
})

xcloneApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});