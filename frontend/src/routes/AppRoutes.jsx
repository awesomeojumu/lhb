import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import routes from "@config/routesConfig";
import ProtectedRoute from "@routes/ProtectedRoute";
import Spinner from "@/components/feedback/Spinner"; // ✅ Loader while lazy loading

// ✅ Auth Pages
const Login = lazy(() => import("@pages/auth/Login"));
const Register = lazy(() => import("@pages/auth/Register"));
const ForgotPassword = lazy(() => import("@pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("@pages/auth/ResetPassword"));

// ✅ Layout & Main Pages
const DashboardLayout = lazy(() => import("@layout/DashboardLayout"));
const DashboardHome = lazy(() => import("@pages/dashboard/DashboardHome"));
const Profile = lazy(() => import("@pages/dashboard/user/Profile"));
const ViewProfile = lazy(() => import("@pages/dashboard/user/ViewProfile"));
const NotFound = lazy(() => import("@pages/misc/NotFound"));
const Settings = lazy(() => import("@pages/misc/Settings"));

// ✅ User Pages
const UserList = lazy(() => import("@pages/admin/UserList"));
const UserDetail = lazy(() => import("@pages/admin/UserDetail"));
const UserManagement = lazy(() => import("@pages/admin/UserManagement"));

// ✅ KPI Pages
const KPIList = lazy(() => import("@pages/dashboard/kpi/KPIList"));
const KPICreate = lazy(() => import("@pages/dashboard/kpi/KPICreate"));
const KPIEdit = lazy(() => import("@pages/dashboard/kpi/KPIEdit"));
const KPIDetail = lazy(() => import("@pages/dashboard/kpi/KPIDetail"));
const KPIManagement = lazy(() => import("@pages/management/KPIManagement"));

// ✅ Management Pages
const BattalionManagement = lazy(() =>
  import("@pages/management/BattalionManagement")
);
const RoleManagement = lazy(() =>
  import("@pages/management/RoleManagement")
);

// ✅ Analytics
const AnalyticsDashboard = lazy(() =>
  import("@pages/dashboard/AnalyticsDashboard")
);

// ✅ Newly Added Pages
const Battalion = lazy(() => import("@pages/dashboard/Battalion"));
const MyKpis = lazy(() => import("@pages/dashboard/MyKpis"));
const Ranks = lazy(() => import("@pages/dashboard/Ranks"));

const AppRoutes = () => {
  return (
    <Suspense fallback={<Spinner />}>
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
            <Route path="/dashboard/profile/view" element={<ViewProfile />} />
            <Route path={routes.settings} element={<Settings />} />

            {/* ✅ Basic Pages (All Roles) */}
            <Route path={routes.battalion} element={<Battalion />} />
            <Route path={routes.myKpis} element={<MyKpis />} />
            <Route path={routes.ranks} element={<Ranks />} />

            {/* ✅ Users (Commander & Commando Only) */}
            <Route
              path={routes.users}
              element={
                <ProtectedRoute allowedRoles={["commander", "commando"]} />
              }
            >
              <Route index element={<UserList />} />
              <Route path={routes.userDetails()} element={<UserDetail />} />
            </Route>

            {/* ✅ View Specific User Profile */}
            <Route
              path="/dashboard/users/:userId"
              element={
                <ProtectedRoute allowedRoles={["commander", "commando"]}>
                  <ViewProfile />
                </ProtectedRoute>
              }
            />

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
              element={
                <ProtectedRoute allowedRoles={["commander", "commando"]} />
              }
            >
              <Route index element={<KPIManagement />} />
            </Route>

            {/* ✅ Battalion Management (Commander & Commando) */}
            <Route
              path={routes.battalionManagement}
              element={
                <ProtectedRoute allowedRoles={["commander", "commando"]} />
              }
            >
              <Route index element={<BattalionManagement />} />
            </Route>

            {/* ✅ Role Management (Commander & Commando) */}
            <Route
              path={routes.roleManagement}
              element={
                <ProtectedRoute allowedRoles={["commander", "commando"]} />
              }
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
              element={
                <ProtectedRoute allowedRoles={["commander", "commando"]} />
              }
            >
              <Route index element={<AnalyticsDashboard />} />
            </Route>
          </Route>
        </Route>

        {/* ✅ 404 Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
