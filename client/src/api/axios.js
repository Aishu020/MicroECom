import axios from "axios";
import { getToken } from "../utils/storage";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE || "http://localhost:8080/api",
  timeout: 10000
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
