// src/admin/components/Sidebar.tsx
import { Link, useLocation } from "react-router-dom";
import { Package, LayoutDashboard, Settings, ChevronDown } from "lucide-react"; // 👈 Agregamos Settings
import logoLight from "../../assets/logo-light.png";
import logoDark from "../../assets/logo-dark.png";
import { useEffect, useState } from "react";

export function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const location = useLocation();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  const [openProducts, setOpenProducts] = useState(location.pathname.startsWith("/admin/products"));

  return (
    <aside
      className={`fixed md:static top-0 left-0 h-full w-60 bg-white dark:bg-zinc-800 shadow-lg p-4
      transform transition-transform duration-300 z-50
      ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
    >
      {/* Logo dinámico con link al Dashboard */}
      <div className="flex justify-center mb-6">
        <Link to="/admin" onClick={onClose}>
          <img
            src={isDark ? logoLight : logoDark}
            alt="WeldZone Logo"
            className="h-12 object-contain hover:scale-105 transition-transform"
          />
        </Link>
      </div>

      <nav className="flex flex-col gap-2">
        <Link
          to="/admin"
          onClick={onClose}
          className={`flex items-center gap-3 p-2 rounded-lg font-medium transition no-underline ${location.pathname === "/admin" ? "bg-yellow-500 text-black shadow-sm" : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-black dark:hover:text-white"}`}
        >
          <LayoutDashboard size={18} /> Dashboard
        </Link>

        <button
          type="button"
          onClick={() => setOpenProducts((v) => !v)}
          className={`w-full flex items-center justify-between p-2 rounded-lg font-medium transition ${location.pathname.startsWith("/admin/products") ? "bg-yellow-500 text-black shadow-sm" : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-black dark:hover:text-white"}`}
        >
          <span className="flex items-center gap-3">
            <Package size={18} /> Productos
          </span>
          <ChevronDown size={16} className={`${openProducts ? "rotate-180" : "rotate-0"} transition-transform`} />
        </button>
        {openProducts && (
          <div className="ml-6 flex flex-col gap-1">
            <Link
              to="/admin/products"
              onClick={onClose}
              className={`flex items-center gap-2 p-2 rounded-md text-sm no-underline ${location.pathname === "/admin/products" ? "bg-yellow-400/90 text-black" : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-black dark:hover:text-white"}`}
            >
              Productos
            </Link>
            <Link
              to="/admin/products/eliminados"
              onClick={onClose}
              className={`flex items-center gap-2 p-2 rounded-md text-sm no-underline ${location.pathname === "/admin/products/eliminados" ? "bg-yellow-400/90 text-black" : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-black dark:hover:text-white"}`}
            >
              Productos eliminados
            </Link>
          </div>
        )}

        <Link
          to="/admin/config"
          onClick={onClose}
          className={`flex items-center gap-3 p-2 rounded-lg font-medium transition no-underline ${location.pathname === "/admin/config" ? "bg-yellow-500 text-black shadow-sm" : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-black dark:hover:text-white"}`}
        >
          <Settings size={18} /> Configuración
        </Link>
      </nav>
    </aside>
  );
}

