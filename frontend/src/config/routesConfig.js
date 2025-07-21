// routesConfig.js

const routes = {
  // ✅ Auth
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  resetPassword: (token = ":token") => `/reset-password/${token}`,

  // ✅ Dashboard (Home = Dashboard overview)
  dashboard: "/dashboard",
  profile: "/dashboard/profile",

  // ✅ User Management
  users: "/dashboard/users",
  userDetails: (id = ":id") => `/dashboard/users/${id}`,
  userManagement: "/dashboard/user-management", // ✅ Added

  // ✅ KPI Management
  kpis: "/dashboard/kpis",
  myKpis: "/dashboard/my-kpis", // ✅ Added
  kpiManagement: "/dashboard/kpi-management", // ✅ Added
  kpiCreate: "/dashboard/kpis/create",
  kpiEdit: (id = ":id") => `/dashboard/kpis/${id}/edit`,
  kpiDetails: (id = ":id") => `/dashboard/kpis/${id}`,

  // ✅ Battalion & Ranks
  battalion: "/dashboard/battalion", // ✅ Added
  battalionManagement: "/dashboard/battalion-management", // ✅ Added
  ranks: "/dashboard/ranks", // ✅ Added
  roleManagement: "/dashboard/role-management", // ✅ Added

  // ✅ Settings
  settings: "/dashboard/settings",

  // ✅ Other
  notFound: "/404",
};

export default routes;
