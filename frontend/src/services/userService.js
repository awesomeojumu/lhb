// src/services/userService.js
import api from "./api";

// Current user's profile
export const getProfile = async () => {
  const { data } = await api.get("/users/me");
  return data;
};

// Update current profile
export const updateProfile = async (profileData) => {
  const { data } = await api.put("/users/me", profileData);
  return data; // { message, user }
};

// List all users (Commander/Commando only)
export const listUsers = async () => {
  const { data } = await api.get("/users");
  return data;
};

// Get a single user by ID (Commander/Commando)
export const getUserById = async (id) => {
  const { data } = await api.get(`/users/${id}`);
  return data;
};

// Delete user (Commander/Commando)
export const deleteUser = async (id) => {
  const { data } = await api.delete(`/users/${id}`);
  return data;
};
