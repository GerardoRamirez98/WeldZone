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
  onExport?: () => void; // descarga de listado (opcional)
}

export default function SidebarCategorias({
  categorias,
  categoriaSeleccionada,
  onSelect,
  totalProductos = 0,
  categoriaActualNombre,
  loading = false,
  onExport,
}: SidebarCategoriasProps) {
  const [open, setOpen] = useState(false);

  // Versión desktop
  const DesktopSidebar = (
    <aside className="hidden md:block bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl p-4 shadow-sm w-64">
      <HeaderSection
        categoriaActualNombre={categoriaActualNombre}
        totalProductos={totalProductos}
        loading={loading}
        onExport={onExport}
      />
      <CategoryList
        categorias={categorias}
        categoriaSeleccionada={categoriaSeleccionada}
        onSelect={onSelect}
      />
    </aside>
  );

  // Versión móvil (botón + modal)
  const MobileDrawer = (
    <>
      {/* Botón abrir filtro */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="md:hidden flex items-center gap-2 bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold shadow-sm active:scale-95 transition mb-4"
      >
        <Filter className="w-4 h-4" /> Filtrar
      </button>

      {/* Drawer */}
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm">
          {/* Fondo clicable */}
          <div className="absolute inset-0" onClick={() => setOpen(false)}></div>

          {/* Panel lateral */}
          <div className="relative z-10 w-4/5 max-w-sm bg-white dark:bg-zinc-900 p-5 shadow-2xl rounded-l-2xl overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Filtrar por</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Botón de descarga en móvil */}
            {onExport && (
              <button
                type="button"
                onClick={onExport}
                className="mb-4 w-full bg-indigo-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 active:scale-[.99] transition"
              >
                Descargar listado (PDF)
              </button>
            )}

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

/* Encabezado */
function HeaderSection({
  categoriaActualNombre,
  totalProductos,
  loading,
  onExport,
}: {
  categoriaActualNombre?: string | null;
  totalProductos: number;
  loading: boolean;
  onExport?: () => void;
}) {
  return (
    <div className="mb-5 border-b border-zinc-200 dark:border-zinc-700 pb-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-tight truncate" title={categoriaActualNombre || 'Catálogo'}>
            {categoriaActualNombre || "Catálogo"}
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            {loading
              ? "Cargando productos..."
              : `${totalProductos} resultado${totalProductos !== 1 ? "s" : ""}`}
          </p>
        </div>
        {typeof onExport === "function" && (
          <button
            type="button"
            onClick={onExport}
            disabled={loading || totalProductos === 0}
            className="ml-auto shrink-0 whitespace-nowrap bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-3 py-1.5 rounded-md text-xs font-semibold hover:bg-indigo-700 transition"
            title="Descargar listado filtrado en PDF"
          >
            Descargar PDF
          </button>
        )}
      </div>
    </div>
  );
}

/* Lista de categorías */
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
      {/* "Todas" */}
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={getCategoryStyle(categoriaSeleccionada === null)}
      >
        Todas
      </button>

      <h3 className="font-semibold text-base mb-3 mt-4 text-zinc-800 dark:text-zinc-100">
        Categorías
      </h3>

      {categorias.length === 0 ? (
        <p className="text-sm text-zinc-400 italic">Cargando...</p>
      ) : (
        <ul className="space-y-1">
          {categorias.map((cat) => (
            <li key={cat.id}>
              <button
                type="button"
                onClick={() => onSelect(cat.id)}
                className={getCategoryStyle(categoriaSeleccionada === cat.id)}
              >
                <span className="truncate capitalize">
                  {cat.nombre.charAt(0).toUpperCase() +
                    cat.nombre.slice(1).toLowerCase()}
                </span>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
