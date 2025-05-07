// Create a ProtectedRoute component
// src/components/auth/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useStore } from "@/lib/zustand";

export const ProtectedRoute = ({
  children,
  allowedRoles = [],
  redirectTo = "/",
}) => {
  const user = useStore((state) => state.user);

  if (!user || !user.uid) {
    return <Navigate to={redirectTo} replace />;
  }

  if (
    allowedRoles.length > 0 &&
    (!user.role || !allowedRoles.includes(user.role))
  ) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};
