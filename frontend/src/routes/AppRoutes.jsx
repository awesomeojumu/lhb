import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import routes from "@config/routesConfig";
import ProtectedRoute from "@routes/ProtectedRoute";

// ✅ Pages & Layouts
import Login from "@pages/auth/Login";
import Register from "@pages/auth/Register";
import ForgotPassword from "@pages/auth/ForgotPassword";
import ResetPassword from "@pages/auth/ResetPassword";
import DashboardLayout from "@layout/DashboardLayout";
import DashboardHome from "@pages/dashboard/DashboardHome";
import Profile from "@pages/user/Profile";
import UserList from "@pages/admin/UserList";
import UserDetail from "@pages/admin/UserDetail";
import KPIList from "@pages/kpi/KPIList";
import KPICreate from "@pages/kpi/KPICreate";
import KPIEdit from "@pages/kpi/KPIEdit";
import KPIDetail from "@pages/kpi/KPIDetail";
import Settings from "@pages/misc/Settings";
import NotFound from "@pages/misc/NotFound";

const AppRoutes = () => {
  return (
    <Routes>
      {/* ✅ Redirect home "/" → login page */}
      <Route path="/" element={<Navigate to={routes.login} replace />} />

      {/* ✅ Public Auth Pages */}
      <Route path={routes.login} element={<Login />} />
      <Route path={routes.register} element={<Register />} />
      <Route path={routes.forgotPassword} element={<ForgotPassword />} />
      <Route path={routes.resetPassword()} element={<ResetPassword />} />

      {/* ✅ Protected Dashboard */}
      <Route element={<ProtectedRoute />}>
        <Route path={routes.dashboard} element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path={routes.profile} element={<Profile />} />

          {/* ✅ Users (Commander & Commando Only) */}
          <Route
            path={routes.users}
            element={<ProtectedRoute allowedRoles={["commander", "commando"]} />}
          >
            <Route index element={<UserList />} />
            <Route path={routes.userDetails()} element={<UserDetail />} />
          </Route>

          {/* ✅ KPI Management */}
          <Route
            path={routes.kpis}
            element={
              <ProtectedRoute
                allowedRoles={[
                  "commander",
                  "commando",
                  "specialForce",
                  "globalSoldier",
                ]}
              />
            }
          >
            <Route index element={<KPIList />} />
            <Route path={routes.kpiCreate} element={<KPICreate />} />
            <Route path={routes.kpiDetails()} element={<KPIDetail />} />
            <Route path={routes.kpiEdit()} element={<KPIEdit />} />
          </Route>

          {/* ✅ Settings */}
          <Route path={routes.settings} element={<Settings />} />

          {/* ✅ 404 INSIDE DASHBOARD (MUST BE LAST) */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>

      {/* ✅ Public 404 (for non-dashboard paths) */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
