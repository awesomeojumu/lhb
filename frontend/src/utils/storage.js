// src/utils/storage.js

// Generic helpers (optional)
export const setItem = (key, value) => localStorage.setItem(key, value);
export const getItem = (key) => localStorage.getItem(key);
export const removeItem = (key) => localStorage.removeItem(key);

// ✅ Token-specific helpers
export const setToken = (token) => localStorage.setItem("token", token);
export const getToken = () => localStorage.getItem("token");
export const removeToken = () => localStorage.removeItem("token");
