// src/services/emailService.js
import api from "./api";

// Single email
export const sendSingleEmail = async (to, subject, html) => {
  const { data } = await api.post("/email/send", { to, subject, html });
  return data;
};

// Bulk email
export const sendBulkEmail = async (recipients, subject, html) => {
  const { data } = await api.post("/email/send-bulk", { recipients, subject, html });
  return data;
};

// Templates (Commander/Commando)
export const getEmailTemplates = async () => {
  const { data } = await api.get("/email/templates");
  return data;
};
