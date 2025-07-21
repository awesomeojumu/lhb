// src/services/notificationService.js
import api from "./api";

export const fetchNotifications = async () => {
  const { data } = await api.get("/logs/notifications");
  return data; // [{ message, time }]
};
