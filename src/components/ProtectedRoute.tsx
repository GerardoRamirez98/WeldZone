import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

type ProtectedRouteProps = {
  children: ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();

  // 🚫 Si no está autenticado → redirige
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Si sí → muestra la ruta protegida
  return <>{children}</>;
}
