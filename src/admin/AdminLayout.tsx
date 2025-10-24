import { Sidebar } from "./components/Sidebar";
import { Topbar } from "./components/Topbar";
import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import ThemeToggle from "../components/ThemeToggle";
import { useAuth } from "../context/useAuth";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-zinc-100 dark:bg-zinc-900">
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Contenido principal */}
      <div className="flex flex-col flex-1">
        <Topbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />

        {/* Barra superior con info del usuario */}
        <div className="flex items-center justify-between px-6 h-12 bg-zinc-200 dark:bg-zinc-800 border-b border-zinc-300 dark:border-zinc-700">
          <div className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-nowrap">
            Conectado como: <strong>{user?.username || "Invitado"}</strong> ({user?.role || "sin rol"})
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-2 h-9 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition"
            >
              Cerrar sesión
            </button>
          </div>
        </div>

        {/* Área principal de páginas */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}


