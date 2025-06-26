import axios from "axios";
import { useAuthStore } from "../store/authStore";

const api: import("axios").AxiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: false, 
});


api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
