import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";
import type { ProtectedRouteProps } from "@/types";

interface ProtectedRouteWithChildrenProps extends ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({
  allowedRoles,
  children,
}: ProtectedRouteWithChildrenProps) => {
  const { user, loading, getMe } = useAuthStore();

  useEffect(() => {
    if (!user) getMe().catch(() => {});
  }, [user, getMe]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role))
    return <Navigate to="/unauthorized" replace />;

  return <>{children}</>;
};
