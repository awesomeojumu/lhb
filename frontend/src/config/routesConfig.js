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

  // ✅ KPI Management
  kpis: "/dashboard/kpis",
  kpiCreate: "/dashboard/kpis/create",
  kpiEdit: (id = ":id") => `/dashboard/kpis/${id}/edit`,
  kpiDetails: (id = ":id") => `/dashboard/kpis/${id}`,

  // ✅ Settings
  settings: "/dashboard/settings",

  // ✅ Other
  notFound: "/404",
};

export default routes;
