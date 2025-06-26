// src/services/api.ts
import axios from "axios";

const api: import("axios").AxiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

export default api;
