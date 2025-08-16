import axios from "axios";

export const xcloneApi = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "http://localhost:8000",
    //     headers: {
    //     "Content-Type": "application/json"
    //   }
});

xcloneApi.interceptors.request.use((config) => {
    const token = JSON.parse(localStorage.getItem("user"))?.token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});