// src/services/authService.js
import api from "./api";

// Login
export const login = async (email, password) => {
  const { data } = await api.post("/auth/login", { email, password });
  return data; // { _id, firstName, lastName, email, role, token }
};

// Register
export const register = async (userData) => {
  const { data } = await api.post("/auth/register", userData);
  return data;
};

// Forgot Password
export const forgotPassword = async (email) => {
  const { data } = await api.post("/auth/forgot-password", { email });
  return data;
};

// Reset Password
export const resetPassword = async (token, password) => {
  const { data } = await api.put(`/auth/reset-password/${token}`, { password });
  return data;
};

// Logout
export const logout = async () => {
  const { data } = await api.post("/auth/logout");
  return data; // { message: "User logged out successfully" }
};
