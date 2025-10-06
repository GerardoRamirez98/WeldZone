import { Sidebar } from "./components/Sidebar";
import { Topbar } from "./components/Topbar";
import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/useAuth"; // 👈 Importamos el contexto

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth(); // ✅ Obtener info del usuario y logout
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // 🧼 Borra el token y el estado global
    navigate("/login"); // 🔁 Redirige al login
  };

  return (
    <div className="flex h-screen bg-zinc-100 dark:bg-zinc-900">
      {/* 📁 Sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* 📦 Contenido principal */}
      <div className="flex flex-col flex-1">
        <Topbar
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />

        {/* ✅ Barra superior con info del usuario */}
        <div className="flex items-center justify-between px-6 py-3 bg-zinc-200 dark:bg-zinc-800 border-b border-zinc-300 dark:border-zinc-700">
          <div className="text-sm text-zinc-700 dark:text-zinc-300">
            👤 Conectado como: <strong>{user?.username || "Invitado"}</strong> (
            {user?.role || "sin rol"})
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-1 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition"
          >
            Cerrar sesión
          </button>
        </div>

        {/* 📄 Área principal de páginas */}
        <main className="p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
