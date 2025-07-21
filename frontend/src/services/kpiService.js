// src/services/kpiService.js
import api from "./api";

// All KPIs (Commander/Commando)
export const getKPIs = async () => {
  const { data } = await api.get("/kpis");
  return data;
};

// My KPIs (Self)
export const getMyKPIs = async () => {
  const { data } = await api.get("/kpis/my");
  return data;
};

// KPI Summary (Self OR Admin)
export const getKPISummary = async () => {
  const { data } = await api.get("/kpis/summary");
  return data;
};

// KPIs for a specific user
export const getUserKPIs = async (userId) => {
  const { data } = await api.get(`/kpis/user/${userId}`);
  return data;
};

// Create/Assign KPI
export const createKPI = async (kpiData) => {
  const { data } = await api.post("/kpis", kpiData);
  return data;
};

// Update KPI
export const updateKPI = async (kpiId, kpiData) => {
  const { data } = await api.put(`/kpis/${kpiId}`, kpiData);
  return data;
};

// Delete KPI
export const deleteKPI = async (kpiId) => {
  const { data } = await api.delete(`/kpis/${kpiId}`);
  return data;
};

// Update KPI Status
export const updateKPIStatus = async (kpiStatusId, statusData) => {
  const { data } = await api.put(`/kpis/status/${kpiStatusId}`, statusData);
  return data;
};
