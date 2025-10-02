// src/admin/components/Sidebar.tsx
import { Link, useLocation } from "react-router-dom";
import { Package, LayoutDashboard, Settings } from "lucide-react"; // 👈 Agregamos Settings
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

  const links = [
    { to: "/admin", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { to: "/admin/products", label: "Productos", icon: <Package size={18} /> },
    {
      to: "/admin/config",
      label: "Configuración",
      icon: <Settings size={18} />,
    }, // 👈 Nuevo link
  ];

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
        {links.map(({ to, label, icon }) => (
          <Link
            key={to}
            to={to}
            onClick={onClose}
            className={`flex items-center gap-3 p-2 rounded-lg font-medium transition no-underline
    ${
      location.pathname === to
        ? "bg-yellow-500 text-black shadow-sm"
        : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-black dark:hover:text-white"
    }`}
          >
            {icon} {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
