import api from "./api";

// ✅ Get all KPIs (Commander / Commando only)
export const getAllKPIs = async () => {
    const { data } = await api.get("/kpis");
    return data;
};

// ✅ Get my KPIs (Self)
export const getMyKPIs = async () => {
    const { data } = await api.get("/kpis/my");
    return data || [];
};

// ✅ KPI Summary (Self)
export const getKPISummary = async () => {
    const { data } = await api.get("/kpis/summary");
    return data || [];
};

// ✅ Get KPIs for a specific user (Commander / Commando)
export const getUserKPIs = async (userId) => {
    if (!userId) throw new Error("User ID is required");
    const { data } = await api.get(`/kpis/user/${userId}`);
    return data || [];
};

// ✅ Get KPI Details (Backend-aligned)
export const getKPIDetails = async (kpiId) => {
    if (!kpiId) throw new Error("KPI ID is required");
    const { data } = await api.get(`/kpis/details/${kpiId}`); // ✅ FIXED
    return data;
};

// ✅ Create / Assign KPI (Commander / Commando)
export const createKPI = async (kpiData) => {
    const payload = {
        title: kpiData.title,
        description: kpiData.description || "",
        target: kpiData.target,
        deadline: kpiData.deadline,
        assignmentType: kpiData.assignmentType || "specific",
    };

    if (kpiData.assignmentType === "specific") {
        payload.userIds = Array.isArray(kpiData.userIds)
            ? kpiData.userIds.filter((id) => id && id.length === 24)
            : [];
    }

    if (kpiData.assignmentType === "role") {
        payload.role = kpiData.role;
    }

    const { data } = await api.post("/kpis", payload);
    return data;
};

// ✅ Update KPI (Commander / Commando)
export const updateKPI = async (kpiId, kpiData) => {
    if (!kpiId) throw new Error("KPI ID is required");
    const { data } = await api.put(`/kpis/${kpiId}`, kpiData);
    return data;
};

// ✅ Delete KPI (Commander / Commando)
export const deleteKPI = async (kpiId) => {
    if (!kpiId) throw new Error("KPI ID is required");
    const { data } = await api.delete(`/kpis/${kpiId}`);
    return data;
};

// ✅ Update KPI Status (Self)
export const updateKPIStatus = async (kpiStatusId, statusData) => {
    if (!kpiStatusId) throw new Error("KPI Status ID is required");
    const { data } = await api.put(`/kpis/status/${kpiStatusId}`, statusData);
    return data;
};
