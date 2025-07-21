const routes = {
  // ✅ Auth
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  resetPassword: (token = ":token") => `/reset-password/${token}`,

  // ✅ Dashboard Home
  dashboard: "/dashboard",

  // ✅ User Profile & Settings
  profile: "/dashboard/profile",
  settings: "/dashboard/settings",

  // ✅ Users (Commander & Commando)
  users: "/dashboard/users",
  userDetails: (id = ":id") => `/dashboard/users/${id}`,
  userManagement: "/dashboard/user-management", // ✅ Commander only

  // ✅ KPIs
  kpis: "/dashboard/kpis",
  kpiCreate: "/dashboard/kpis/create",
  kpiDetails: (id = ":id") => `/dashboard/kpis/${id}`,
  kpiEdit: (id = ":id") => `/dashboard/kpis/${id}/edit`,
  myKpis: "/dashboard/my-kpis", // ✅ All roles
  kpiManagement: "/dashboard/kpi-management", // ✅ Commando & Commander

  // ✅ Battalion & Ranks
  battalion: "/dashboard/battalion", // ✅ All roles
  battalionManagement: "/dashboard/battalion-management", // ✅ Commando & Commander
  ranks: "/dashboard/ranks", // ✅ All roles
  roleManagement: "/dashboard/role-management", // ✅ Commando & Commander

  // ✅ Analytics
  analytics: "/dashboard/analytics", // ✅ Commando & Commander
};

export default routes;
