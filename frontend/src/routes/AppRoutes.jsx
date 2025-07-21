import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import routes from "@config/routesConfig";
import ProtectedRoute from "@routes/ProtectedRoute";

// ✅ Auth Pages
import Login from "@pages/auth/Login";
import Register from "@pages/auth/Register";
import ForgotPassword from "@pages/auth/ForgotPassword";
import ResetPassword from "@pages/auth/ResetPassword";

// ✅ Layout & Main Pages
import DashboardLayout from "@layout/DashboardLayout";
import DashboardHome from "@pages/dashboard/DashboardHome";
import Profile from "@pages/user/Profile";
import NotFound from "@pages/misc/NotFound";
import Settings from "@pages/misc/Settings";

// ✅ User Pages
import UserList from "@pages/admin/UserList";
import UserDetail from "@pages/admin/UserDetail";
import UserManagement from "@pages/admin/UserManagement";

// ✅ KPI Pages
import KPIList from "@pages/kpi/KPIList";
import KPICreate from "@pages/kpi/KPICreate";
import KPIEdit from "@pages/kpi/KPIEdit";
import KPIDetail from "@pages/kpi/KPIDetail";
import KPIManagement from "@pages/management/KPIManagement";

// ✅ Management Pages
import BattalionManagement from "@pages/management/BattalionManagement";
import RoleManagement from "@pages/management/RoleManagement";

// ✅ Analytics
import AnalyticsDashboard from "@pages/dashboard/AnalyticsDashboard";

// ✅ Newly Added Pages
import Battalion from "@pages/dashboard/Battalion";
import MyKpis from "@pages/dashboard/MyKpis";
import Ranks from "@pages/dashboard/Ranks";

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
          <Route path={routes.settings} element={<Settings />} />

          {/* ✅ Basic Pages (All Roles) */}
          <Route path={routes.battalion} element={<Battalion />} />
          <Route path={routes.myKpis} element={<MyKpis />} />
          <Route path={routes.ranks} element={<Ranks />} />

          {/* ✅ Users (Commander & Commando Only) */}
          <Route
            path={routes.users}
            element={<ProtectedRoute allowedRoles={["commander", "commando"]} />}
          >
            <Route index element={<UserList />} />
            <Route path={routes.userDetails()} element={<UserDetail />} />
          </Route>

          {/* ✅ KPI (All Roles) */}
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

          {/* ✅ KPI Management (Commander & Commando) */}
          <Route
            path={routes.kpiManagement}
            element={<ProtectedRoute allowedRoles={["commander", "commando"]} />}
          >
            <Route index element={<KPIManagement />} />
          </Route>

          {/* ✅ Battalion Management (Commander & Commando) */}
          <Route
            path={routes.battalionManagement}
            element={<ProtectedRoute allowedRoles={["commander", "commando"]} />}
          >
            <Route index element={<BattalionManagement />} />
          </Route>

          {/* ✅ Role Management (Commander & Commando) */}
          <Route
            path={routes.roleManagement}
            element={<ProtectedRoute allowedRoles={["commander", "commando"]} />}
          >
            <Route index element={<RoleManagement />} />
          </Route>

          {/* ✅ User Management (Commander Only) */}
          <Route
            path={routes.userManagement}
            element={<ProtectedRoute allowedRoles={["commander"]} />}
          >
            <Route index element={<UserManagement />} />
          </Route>

          {/* ✅ Analytics Dashboard (Commander & Commando) */}
          <Route
            path={routes.analytics}
            element={<ProtectedRoute allowedRoles={["commander", "commando"]} />}
          >
            <Route index element={<AnalyticsDashboard />} />
          </Route>
        </Route>
      </Route>

      {/* ✅ 404 Page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
