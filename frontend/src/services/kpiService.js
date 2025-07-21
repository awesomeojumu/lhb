import api from "./api";

// ✅ Get all KPIs
export const getAllKPIs = async () => {
  const { data } = await api.get("/kpis");
  return data;
};

// ✅ Get my KPIs
export const getMyKPIs = async () => {
  const { data } = await api.get("/kpis/my");
  return data;
};

// ✅ KPI Summary
export const getKPISummary = async () => {
  const { data } = await api.get("/kpis/summary");
  return data;
};

// ✅ Get KPIs for a specific user
export const getUserKPIs = async (userId) => {
  const { data } = await api.get(`/kpis/user/${userId}`);
  return data;
};

// ✅ Get a single KPI by ID
export const getKPIDetails = async (kpiId) => {
  const { data } = await api.get(`/kpis/${kpiId}`);
  return data;
};

// ✅ Create / Assign KPI
export const createKPI = async (kpiData) => {
  const { data } = await api.post("/kpis", kpiData);
  return data;
};

// ✅ Update KPI
export const updateKPI = async (kpiId, kpiData) => {
  const { data } = await api.put(`/kpis/${kpiId}`, kpiData);
  return data;
};

// ✅ Delete KPI
export const deleteKPI = async (kpiId) => {
  const { data } = await api.delete(`/kpis/${kpiId}`);
  return data;
};

// ✅ Update KPI Status
export const updateKPIStatus = async (kpiStatusId, statusData) => {
  const { data } = await api.put(`/kpis/status/${kpiStatusId}`, statusData);
  return data;
};
