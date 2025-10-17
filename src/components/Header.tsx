import { Search, Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { Link, useLocation } from "react-router-dom";
import * as Dialog from "@radix-ui/react-dialog";
import logoDark from "../assets/logo-dark.png";
import logoLight from "../assets/logo-light.png";
import EstadoTienda from "./EstadoTienda";

export default function Header({
  onSearch,
}: {
  onSearch: (q: string) => void;
}) {
  const location = useLocation();

  const links = [
    { to: "/", label: "Catálogo" },
    { to: "/nosotros", label: "Nosotros" },
  ];

  return (
    <header
      className="sticky top-0 z-30 border-b bg-white/70 backdrop-blur
                 border-zinc-200 dark:border-zinc-800 dark:bg-zinc-950/70"
    >
      <div className="container flex items-center justify-between py-3">
        {/* Logo dinámico */}
        <Link
          to="/"
          className="flex flex-col items-start gap-1 hover:scale-105 transition-transform"
        >
          <div className="flex items-center gap-2">
            <img
              src={logoDark}
              alt="WeldZone Logo"
              className="h-12 w-auto object-contain dark:hidden"
            />
            <img
              src={logoLight}
              alt="WeldZone Logo"
              className="h-12 w-auto object-contain hidden dark:block"
            />
          </div>
          <EstadoTienda />
        </Link>

        {/* Navegación desktop (línea amarilla animada) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {links.map(({ to, label }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`relative group px-2 py-1 transition-colors duration-300
                  ${
                    active
                      ? "text-yellow-500 dark:text-yellow-400 font-semibold"
                      : "text-zinc-700 dark:text-zinc-300 hover:text-yellow-500 dark:hover:text-yellow-400"
                  }`}
              >
                {label}
                {/* Línea animada */}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 w-full scale-x-0 transform bg-yellow-500 dark:bg-yellow-400 transition-transform duration-300 ${
                    active ? "scale-x-100" : "group-hover:scale-x-100"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Buscador + ThemeToggle desktop */}
        <div className="hidden md:flex items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Buscar productos…"
              className="w-72 rounded-xl border bg-white pl-9 pr-3 py-2 text-sm outline-none
                         border-zinc-300 text-zinc-900 placeholder:text-zinc-500
                         focus:border-yellow-500 dark:focus:border-yellow-400
                         dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500"
            />
          </div>
          <ThemeToggle />
        </div>

        {/* Menú móvil */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <label className="p-2.5 rounded-md bg-zinc-900 text-white hover:bg-zinc-800 transition-colors">
                <Menu className="h-5 w-5" />
              </label>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
              <Dialog.Content
                className="fixed top-0 right-0 h-full w-64 
     bg-zinc-50 dark:bg-zinc-950 
     text-zinc-900 dark:text-zinc-100 
     shadow-lg z-50 flex flex-col p-6 
     animate-in slide-in-from-right duration-300"
              >
                {/* ✅ Título y descripción accesibles (invisibles) */}
                <Dialog.Title className="sr-only">Menú principal</Dialog.Title>
                <Dialog.Description className="sr-only">
                  Navegación principal del sitio
                </Dialog.Description>

                {/* Header del menú visible */}
                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-bold">Menú</span>
                  <Dialog.Close asChild>
                    <label className="p-2 rounded-md bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors">
                      <X className="h-5 w-5" />
                    </label>
                  </Dialog.Close>
                </div>

                {/* Navegación móviles */}
                <nav className="flex flex-col gap-4 text-base">
                  {links.map(({ to, label }) => {
                    const active = location.pathname === to;
                    return (
                      <Link
                        key={to}
                        to={to}
                        className={`relative group px-2 py-1 transition-colors duration-300 ${
                          active
                            ? "text-yellow-500 dark:text-yellow-400 font-semibold"
                            : "text-zinc-900 dark:text-zinc-100 hover:text-yellow-500 dark:hover:text-yellow-400"
                        }`}
                      >
                        {label}
                        <span
                          className={`absolute -bottom-1 left-0 h-0.5 w-full scale-x-0 transform bg-yellow-500 dark:bg-yellow-400 transition-transform duration-300 ${
                            active ? "scale-x-100" : "group-hover:scale-x-100"
                          }`}
                        />
                      </Link>
                    );
                  })}
                </nav>

                {/* Buscador móvil */}
                <div className="mt-6 relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <input
                    onChange={(e) => onSearch(e.target.value)}
                    placeholder="Buscar productos…"
                    className="w-full rounded-xl border bg-white dark:bg-zinc-900 pl-9 pr-3 py-2 text-sm outline-none
                 border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 
                 placeholder:text-zinc-500 dark:placeholder:text-zinc-500 
                 focus:border-yellow-500 dark:focus:border-yellow-400"
                  />
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </header>
  );
}
