import { Search } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export default function Header({
  onSearch,
}: {
  onSearch: (q: string) => void;
}) {
  return (
    <header
      className="sticky top-0 z-30 border-b bg-white/70 backdrop-blur
                        border-zinc-200 dark:border-zinc-800 dark:bg-zinc-950/70"
    >
      <div className="container flex items-center justify-between py-3">
        <div className="text-xl font-extrabold text-zinc-900 dark:text-white">
          Weld
          <span className="text-emerald-600 dark:text-emerald-400">Zone</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative hidden sm:block">
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
      </div>
    </header>
  );
}
