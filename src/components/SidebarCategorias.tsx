import { useState } from "react";
import { X, Filter, ChevronRight } from "lucide-react";

interface Categoria {
  id: number;
  nombre: string;
  count?: number; // cantidad de productos
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
  const [open, setOpen] = useState(false);

  // 💡 Versión desktop
  const DesktopSidebar = (
    <aside className="hidden md:block bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl p-4 shadow-sm w-64">
      <Header
        categoriaActualNombre={categoriaActualNombre}
        totalProductos={totalProductos}
        loading={loading}
      />
      <CategoryList
        categorias={categorias}
        categoriaSeleccionada={categoriaSeleccionada}
        onSelect={onSelect}
      />
    </aside>
  );

  // 📱 Versión móvil (botón + modal)
  const MobileDrawer = (
    <>
      {/* Botón abrir filtro */}
      <label
        onClick={() => setOpen(true)}
        className="md:hidden flex items-center gap-2 bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold shadow-sm active:scale-95 transition mb-4"
      >
        <Filter className="w-4 h-4" /> Filtrar
      </label>

      {/* Drawer */}
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm">
          {/* Fondo clicable */}
          <div
            className="absolute inset-0"
            onClick={() => setOpen(false)}
          ></div>

          {/* Panel lateral */}
          <div className="relative z-10 w-4/5 max-w-sm bg-white dark:bg-zinc-900 p-5 shadow-2xl rounded-l-2xl overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Filtrar por</h2>
              <label
                onClick={() => setOpen(false)}
                className="p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </label>
            </div>

            <CategoryList
              categorias={categorias}
              categoriaSeleccionada={categoriaSeleccionada}
              onSelect={(id) => {
                onSelect(id);
                setOpen(false);
              }}
            />
          </div>
        </div>
      )}
    </>
  );

  return (
    <>
      {DesktopSidebar}
      {MobileDrawer}
    </>
  );
}

/* 🏷️ Encabezado */
function Header({
  categoriaActualNombre,
  totalProductos,
  loading,
}: {
  categoriaActualNombre?: string | null;
  totalProductos: number;
  loading: boolean;
}) {
  return (
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
  );
}

/* 📁 Lista de categorías */
function CategoryList({
  categorias,
  categoriaSeleccionada,
  onSelect,
}: {
  categorias: Categoria[];
  categoriaSeleccionada: number | null;
  onSelect: (id: number | null) => void;
}) {
  const getCategoryStyle = (isActive: boolean) =>
    `w-full flex justify-between items-center px-3 py-1.5 rounded-md text-sm font-medium transition 
     ${
       isActive
         ? "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400"
         : "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
     }`;

  return (
    <div>
      {/* 🔝 “Todas” */}
      <label
        onClick={() => onSelect(null)}
        className={getCategoryStyle(categoriaSeleccionada === null)}
      >
        Todas
      </label>

      <h3 className="font-semibold text-base mb-3 mt-4 text-zinc-800 dark:text-zinc-100">
        Categorías
      </h3>

      {categorias.length === 0 ? (
        <p className="text-sm text-zinc-400 italic">Cargando...</p>
      ) : (
        <ul className="space-y-1">
          {categorias.map((cat) => (
            <li key={cat.id}>
              <label
                onClick={() => onSelect(cat.id)}
                className={getCategoryStyle(categoriaSeleccionada === cat.id)}
              >
                <span className="truncate capitalize">
                  {cat.nombre.charAt(0).toUpperCase() +
                    cat.nombre.slice(1).toLowerCase()}
                </span>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
