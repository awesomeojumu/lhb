// src/services/api.js
import axios from "axios";
import { getToken } from "../utils/storage";

// Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://localhost:5000/api",
});

// Attach JWT automatically
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Global error handling (returns a standardized object)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const res = error.response;
    const formattedError = {
      status: res?.status || 500,
      message:
        res?.data?.message ||
        res?.data?.error ||
        "Something went wrong. Try again.",
      validationErrors: res?.data?.errors || [], // For form fields
    };
    return Promise.reject(formattedError);
  }
);

export default api;
