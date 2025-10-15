import { useState, useEffect, useCallback, type ReactNode } from "react";
import { AuthContext } from "./auth-context";
import type { AuthContextType, User } from "./auth-context";
import Loader from "../components/Loader";

// 🌐 URL dinámica para desarrollo y producción
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Obtener perfil desde el backend (memoizado con useCallback)
  const fetchUser = useCallback(async (token: string) => {
    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Token inválido o expirado");
      const data = await res.json();
      setUser(data.user);
    } catch {
      logout();
    }
  }, []);

  // ✅ Verificar sesión al montar
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUser(token).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [fetchUser]);

  // ✅ Login
  const login = async (token: string) => {
    localStorage.setItem("token", token);
    await fetchUser(token);
  };

  // ✅ Logout
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
  };

  if (loading) {
    return <Loader />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
