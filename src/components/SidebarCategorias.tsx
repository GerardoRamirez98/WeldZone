import { ChevronRight } from "lucide-react";

interface Categoria {
  id: number;
  nombre: string;
}

interface SidebarCategoriasProps {
  categorias: Categoria[];
  categoriaSeleccionada: number | null;
  onSelect: (id: number | null) => void;
  totalProductos?: number;
  categoriaActualNombre?: string | null;
  loading?: boolean;
}

export default function SidebarCategorias({
  categorias,
  categoriaSeleccionada,
  onSelect,
  totalProductos = 0,
  categoriaActualNombre,
  loading = false,
}: SidebarCategoriasProps) {
  return (
    <aside className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl p-4 shadow-sm w-full md:w-64 lg:w-72">
      {/* 📦 Encabezado */}
      <div className="mb-5 border-b border-zinc-200 dark:border-zinc-700 pb-3">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-tight">
          {categoriaActualNombre || "Catálogo"}
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          {loading
            ? "Cargando productos..."
            : `${totalProductos} resultado${totalProductos !== 1 ? "s" : ""}`}
        </p>
      </div>

      {/* 🔝 Botón “Todas” */}
      <button
        onClick={() => onSelect(null)}
        className={`w-full text-left px-3 py-2 mb-3 rounded-md text-sm font-medium transition border
          ${
            categoriaSeleccionada === null
              ? "bg-yellow-500 text-black border-yellow-400 shadow-sm"
              : "hover:bg-zinc-100 dark:hover:bg-zinc-800 border-transparent text-zinc-700 dark:text-zinc-300"
          }`}
      >
        Todas
      </button>

      {/* 📁 Lista de categorías */}
      <h3 className="font-semibold text-base mb-3 text-zinc-800 dark:text-zinc-100">
        Categorías
      </h3>

      {categorias.length === 0 ? (
        <p className="text-sm text-zinc-400 italic">Cargando...</p>
      ) : (
        <ul className="space-y-1">
          {categorias.map((cat) => (
            <li key={cat.id}>
              <button
                onClick={() => onSelect(cat.id)}
                className={`w-full flex justify-between items-center px-3 py-1.5 rounded-md text-sm font-medium transition
                  ${
                    categoriaSeleccionada === cat.id
                      ? "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400"
                      : "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                  }`}
              >
                <span className="truncate">
                  {cat.nombre.charAt(0).toUpperCase() +
                    cat.nombre.slice(1).toLowerCase()}
                </span>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
