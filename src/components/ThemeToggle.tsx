import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

function getInitialDark(): boolean {
  const saved = localStorage.getItem("theme");
  if (saved === "dark") return true;
  if (saved === "light") return false;
  // fallback a preferencia del sistema
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState<boolean>(getInitialDark);

  // Aplica la clase a <html> y guarda preferencia
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const handleClick = () => setIsDark((v) => !v);

  // Label muestra a qué modo VAS a cambiar:
  const nextLabel = isDark ? "Light" : "Dark";

  return (
    <button
      onClick={handleClick}
      className="
    flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition
    border
    bg-zinc-900 text-white hover:bg-zinc-800 border-zinc-900
    dark:bg-zinc-100 dark:text-white dark:hover:bg-zinc-200 dark:border-zinc-200
"
      aria-label={`Cambiar a ${nextLabel}`}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      <span className="hidden sm:inline">{nextLabel}</span>
    </button>
  );
}
