import { Search, Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { Link, useLocation } from "react-router-dom";
import * as Dialog from "@radix-ui/react-dialog";

export default function Header({
  onSearch,
}: {
  onSearch: (q: string) => void;
}) {
  const location = useLocation();

  const navLinks = [
    { to: "/", label: "Catálogo" },
    { to: "/about", label: "About" },
  ];

  return (
    <header
      className="sticky top-0 z-30 border-b bg-white/70 backdrop-blur
                 border-zinc-200 dark:border-zinc-800 dark:bg-zinc-950/70"
    >
      <div className="container flex items-center justify-between py-3">
        {/* Logo */}
        <div className="text-xl font-extrabold text-zinc-900 dark:text-white">
          <Link to="/">
            Weld
            <span className="text-emerald-600 dark:text-emerald-400">Zone</span>
          </Link>
        </div>

        {/* Navegación en escritorio */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`transition-colors ${
                location.pathname === to
                  ? "text-emerald-600 dark:text-emerald-400 font-semibold"
                  : "hover:text-emerald-600"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Buscador y toggle en escritorio */}
        <div className="hidden md:flex items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Buscar productos…"
              className="w-72 rounded-xl border bg-white pl-9 pr-3 py-2 text-sm outline-none
                         border-zinc-300 text-zinc-900 placeholder:text-zinc-500
                         focus:border-emerald-600
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
              <button
                className="p-2 rounded-md 
                   bg-zinc-900 text-white 
                   hover:bg-zinc-800
                   transition-colors"
              >
                <Menu className="h-6 w-6 text-white" />
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
              <Dialog.Content
                className="fixed top-0 right-0 h-full w-64 bg-white dark:bg-zinc-950 shadow-lg z-50
                   flex flex-col p-6"
              >
                {/* Header menú */}
                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-bold text-zinc-900 dark:text-white">
                    Menú
                  </span>
                  <Dialog.Close asChild>
                    <button
                      className="p-2 rounded-md 
                         bg-zinc-900 text-white 
                         hover:bg-zinc-800
                         transition-colors"
                    >
                      <X className="h-5 w-5 text-white" />
                    </button>
                  </Dialog.Close>
                </div>

                {/* Links */}
                <nav className="flex flex-col gap-4 text-base">
                  {navLinks.map(({ to, label }) => (
                    <Link
                      key={to}
                      to={to}
                      className={`transition-colors ${
                        location.pathname === to
                          ? "text-emerald-600 dark:text-emerald-400 font-semibold"
                          : "hover:text-emerald-600"
                      }`}
                    >
                      {label}
                    </Link>
                  ))}
                </nav>

                {/* Buscador móvil */}
                <div className="mt-6 relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <input
                    onChange={(e) => onSearch(e.target.value)}
                    placeholder="Buscar productos…"
                    className="w-full rounded-xl border bg-white pl-9 pr-3 py-2 text-sm outline-none
                               border-zinc-300 text-zinc-900 placeholder:text-zinc-500
                               focus:border-emerald-600
                               dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500"
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
