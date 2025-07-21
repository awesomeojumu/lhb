import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Spinner from "@components/feedback/Spinner";

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) return <Spinner />;

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles.length && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
