import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import routes from "@config/routesConfig";
import ProtectedRoute from "@routes/ProtectedRoute";
import Spinner from "@/components/feedback/Spinner";

// ✅ Auth Pages
const Login = lazy(() => import("@pages/auth/Login"));
const Register = lazy(() => import("@pages/auth/Register"));
const ForgotPassword = lazy(() => import("@pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("@pages/auth/ResetPassword"));

// ✅ Layout & Main Pages
const DashboardLayout = lazy(() => import("@layout/DashboardLayout"));
const DashboardHome = lazy(() => import("@pages/dashboard/DashboardHome"));
const Profile = lazy(() => import("@pages/dashboard/user/Profile"));
const UserProfileView = lazy(() => import("@pages/dashboard/user/UserProfileView"));
const NotFound = lazy(() => import("@pages/misc/NotFound"));
const Settings = lazy(() => import("@pages/misc/Settings"));

// ✅ User Pages (Admin & Management)
const UserList = lazy(() => import("@pages/admin/UserList"));
const UserManagement = lazy(() => import("@pages/admin/UserManagement"));

// ✅ KPI Pages
const KPIList = lazy(() => import("@pages/dashboard/kpi/KPIList"));
const KPICreate = lazy(() => import("@pages/dashboard/kpi/KPICreate"));
const KPIEdit = lazy(() => import("@pages/dashboard/kpi/KPIEdit"));
const KPIDetail = lazy(() => import("@pages/dashboard/kpi/KPIDetail"));

// ✅ Management Pages
const KPIManagement = lazy(() => import("@pages/management/KPIManagement"));
const BattalionManagement = lazy(() => import("@pages/management/BattalionManagement"));
const RoleManagement = lazy(() => import("@pages/management/RoleManagement"));
const ManagementDashboard = lazy(() => import("@pages/management/ManagementDashboard"));

// ✅ Basic Dashboard Pages
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

                {/* ✅ Dashboard Layout */}
                <Route element={<ProtectedRoute />}>
                    <Route path={routes.dashboard} element={<DashboardLayout />}>
                        <Route index element={<DashboardHome />} />
                        <Route path={routes.profile} element={<Profile />} />
                        <Route path={routes.viewProfile()} element={<UserProfileView />} />
                        <Route path={routes.settings} element={<Settings />} />

                        {/* ✅ Basic Pages */}
                        <Route path={routes.battalion} element={<Battalion />} />
                        <Route path={routes.myKpis} element={<MyKpis />} />
                        <Route path={routes.ranks} element={<Ranks />} />

                        {/* ✅ KPI Pages (All CRUD under /dashboard/kpis) */}
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
                            <Route path="create" element={<KPICreate />} />
                            <Route path=":kpiId" element={<KPIDetail />} />
                            <Route path=":kpiId/edit" element={<KPIEdit />} />
                        </Route>

                        {/* ✅ Management Pages */}
                        <Route
                            path={routes.dashboardManagement}
                            element={<ProtectedRoute allowedRoles={["commander", "commando"]} />}
                        >
                            <Route index element={<ManagementDashboard />} />
                        </Route>

                        <Route
                            path={routes.kpiManagement}
                            element={<ProtectedRoute allowedRoles={["commander", "commando"]} />}
                        >
                            <Route index element={<KPIManagement />} />
                        </Route>

                        <Route
                            path={routes.battalionManagement}
                            element={<ProtectedRoute allowedRoles={["commander", "commando"]} />}
                        >
                            <Route index element={<BattalionManagement />} />
                        </Route>

                        <Route
                            path={routes.roleManagement}
                            element={<ProtectedRoute allowedRoles={["commander", "commando"]} />}
                        >
                            <Route index element={<RoleManagement />} />
                        </Route>

                        {/* ✅ Users */}
                        <Route
                            path={routes.users}
                            element={<ProtectedRoute allowedRoles={["commander", "commando"]} />}
                        >
                            <Route index element={<UserList />} />
                            <Route
                                path={routes.userDetails()}
                                element={<UserProfileView minimal />}
                            />
                        </Route>

                        <Route
                            path={routes.userManagement}
                            element={<ProtectedRoute allowedRoles={["commander"]} />}
                        >
                            <Route index element={<UserManagement />} />
                        </Route>
                    </Route>
                </Route>

                {/* ✅ 404 */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Suspense>
    );
};

export default AppRoutes;
