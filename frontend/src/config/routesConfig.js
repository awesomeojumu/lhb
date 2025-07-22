export default {
    // ✅ Dashboard Root
    dashboard: "/dashboard",

    // ✅ Basic Dashboard Pages (relative to /dashboard)
    myKpis: "my-kpis",
    battalion: "battalion",
    ranks: "ranks",
    profile: "profile",
    viewProfile: (id = ":id") => `profile/view/${id}`,
    settings: "settings",

    // ✅ KPI Pages (relative to /dashboard)
    kpis: "kpis",
    kpiCreate: "kpis/create",
    kpiDetails: (kpiId = ":kpiId") => `kpis/${kpiId}`, // ✅ matches backend
    kpiEdit: (kpiId = ":kpiId") => `kpis/${kpiId}/edit`, // ✅ matches backend

    // ✅ Management Pages
    dashboardManagement: "management/dashboard",
    kpiManagement: "management/kpi-management",
    battalionManagement: "management/battalion-management",
    roleManagement: "management/role-management",

    // ✅ User Management
    users: "users",
    userDetails: (id = ":id") => `users/${id}`,
    userManagement: "admin/user-management",

    // ✅ Auth Pages
    login: "/login",
    register: "/register",
    forgotPassword: "/forgot-password",
    resetPassword: (token = ":token") => `/reset-password/${token}`,
};
