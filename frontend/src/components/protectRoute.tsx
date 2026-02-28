import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import type { ProtectedRouteProps } from "@/types";

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { token, user } = useAuthStore();

  // 1. If not logged in, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. If logged in but role doesn't match, redirect to a "not authorized" page (optional)
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 3. If everything is fine, render the child routes
  return <Outlet />;
};
