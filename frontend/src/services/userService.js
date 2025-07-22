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

// Update user role (Commander/Commando)
export const updateUserRole = async (userId, role) => {
  const { data } = await api.put(`/users/${userId}/role`, { role });
  return data;
};

// Update user battalion (Commander/Commando)
export const updateUserBattalion = async (userId, battalion) => {
  const { data } = await api.put(`/users/${userId}/battalion`, { battalion });
  return data;
};

export const getUserProfile = async (userId) => {
  if (!userId) throw new Error("User ID is required");
  const { data } = await api.get(`/users/${userId}`);
  return data;
};

// ✅ Logged-in user's profile (no ID needed)
export const getMyProfile = async () => {
  const { data } = await api.get("/users/me");
  return data;
};

// Update user profile (for current user)
export const updateUserProfile = async (userId, updatedData) => {
  const response = await api.put(`/users/${userId}`, updatedData);
  return response.data;
};