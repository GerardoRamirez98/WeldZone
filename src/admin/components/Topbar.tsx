// src/admin/components/Topbar.tsx
import { Menu, X } from "lucide-react";

export function Topbar({
  onToggleSidebar,
  sidebarOpen,
}: {
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}) {
  return (
    <header className="flex justify-between items-center h-14 px-4 border-b dark:border-zinc-700 flex-none">
      {/* Botón Hamburguesa (solo móvil) */}
      <button
        className="md:hidden bg-yellow-500 text-white p-2 rounded"
        onClick={onToggleSidebar}
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Espaciador flexible */}
      <div className="flex-1" />

      {/* Área reservada a la derecha (vacía por ahora) */}
    </header>
  );
}

