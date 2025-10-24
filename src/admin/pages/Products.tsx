import { useMemo, useState } from "react";
import AddProductModal from "../components/AddProductModal";
import EditProductModal from "../components/EditProductModal";
import { Dialog } from "@headlessui/react";
import type { Product } from "../../types/products";
import { useProducts, useDeleteProduct } from "../../hooks/useProducts";
import { toast } from "sonner";
import { FileText, Tag } from "lucide-react";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useCategorias } from "@/hooks/useCategories";
import { exportProductsPdf } from "@/utils/pdf";

export default function Products() {
  // 🧩 React Query hooks
  const { products, loading, error } = useProducts();
  const { mutate: deleteProduct } = useDeleteProduct();

  // 🧠 Estados locales (solo UI)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [productoEdit, setProductoEdit] = useState<Product | null>(null);
  const [productoDelete, setProductoDelete] = useState<Product | null>(null);
  const { data: categorias = [] } = useCategorias();
  const [categoriaId, setCategoriaId] = useState<number | "all">("all");

  const filteredForPdf = useMemo(() => {
    if (categoriaId === "all") return products;
    return products.filter((p) => p.categoria?.id === categoriaId);
  }, [products, categoriaId]);

  // ✅ Loader / error
  if (loading)
    return (
      <div className="flex justify-center items-center h-96 text-zinc-400">
        Cargando productos...
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col justify-center items-center h-96 text-red-400">
        <p>❌ Error al cargar productos.</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-3 bg-yellow-500 text-black px-3 py-1 rounded hover:bg-yellow-400"
        >
          Reintentar
        </button>
      </div>
    );

  return (
    <div>
      {/* 🧭 Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gestión de Productos</h2>
        <button
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition font-medium"
          onClick={() => setIsAddModalOpen(true)}
        >
          + Agregar
        </button>
      </div>

      {/* 🗂️ Grid de productos */}
      {/* Herramientas de exportación */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <label className="text-sm text-zinc-600 dark:text-zinc-300">Categoría:</label>
          <select
            className="px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm"
            value={categoriaId}
            onChange={(e) => {
              const v = e.target.value;
              setCategoriaId(v === 'all' ? 'all' : Number(v));
            }}
          >
            <option value="all">Todas</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>

        <button
          className="w-full sm:w-auto bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition text-sm"
          onClick={async () => {
            try {
              const catName =
                categoriaId === 'all'
                  ? undefined
                  : categorias.find((c) => c.id === categoriaId)?.nombre;
              await exportProductsPdf(filteredForPdf, {
                title: 'Listado de Productos',
                categoryName: catName,
              });
            } catch (err) {
              console.error('Error exportando PDF:', err);
              toast.error('No se pudo generar el PDF');
            }
          }}
        >
          Exportar PDF
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((p) => (
          <div
            key={p.id}
            className="group relative rounded-2xl border bg-white p-3 shadow-sm transition 
              border-zinc-200 hover:shadow-md 
              dark:border-zinc-800 dark:bg-zinc-900"
          >
            {/* 🏷️ Etiqueta (dinámica desde backend) */}
            {p.etiqueta?.nombre && (
              <div
                className="absolute left-3 top-3 z-20 flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold text-white shadow-md
                transition-transform duration-300 group-hover:scale-110 animate-[pulse-soft_3s_ease-in-out_infinite]"
                style={{
                  backgroundColor: p.etiqueta?.color || "#666",
                }}
              >
                <Tag className="h-3 w-3" />
                {p.etiqueta?.nombre}
              </div>
            )}

            {/* 🖼️ Imagen con tooltip de especificaciones */}
            <div className="aspect-square overflow-hidden rounded-xl relative group">
              {p.imagenUrl ? (
                <img
                  src={p.imagenUrl}
                  alt={p.nombre}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-zinc-200 dark:bg-zinc-800 text-zinc-500 text-sm rounded-xl">
                  Sin imagen
                </div>
              )}

              {/* 📄 Tooltip Ver Especificaciones */}
              {p.specFileUrl && (
                <Tooltip.Provider delayDuration={150}>
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <button
                        type="button"
                        aria-label="Ver ficha técnica"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(
                            `https://docs.google.com/viewer?url=${encodeURIComponent(
                              p.specFileUrl as string
                            )}&embedded=true`,
                            "_blank"
                          );
                        }}
                        className="absolute bottom-2 right-2 z-20 flex items-center justify-center
                        w-9 h-9 rounded-full bg-yellow-500 hover:bg-yellow-400 
                        shadow-md transition active:scale-95 cursor-pointer
                        hover:shadow-[0_0_10px_2px_rgba(255,213,0,0.6)]
                        animate-[pulse-soft_3s_ease-in-out_infinite]"
                      >
                        <FileText
                          className="w-4 h-4 text-white"
                          strokeWidth={2.2}
                        />
                      </button>
                    </Tooltip.Trigger>

                    {/* ✨ Tooltip animado */}
                    <Tooltip.Portal>
                      <Tooltip.Content
                        side="top"
                        sideOffset={6}
                        className="rounded-md bg-zinc-800 px-2 py-1 text-xs text-zinc-100 shadow-sm 
                        data-[state=delayed-open]:animate-fadeIn 
                        data-[state=closed]:animate-fadeOut"
                      >
                        Ver ficha técnica
                        <Tooltip.Arrow className="fill-zinc-800" />
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  </Tooltip.Root>
                </Tooltip.Provider>
              )}
            </div>

            {/* 📋 Información */}
            <div className="mt-3 flex flex-col justify-between">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-white line-clamp-1">
                {p.nombre}
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 min-h-[32px]">
                {p.descripcion || "Sin descripción"}
              </p>

              <div className="mt-2 flex justify-between items-center">
                <span className="text-sm font-bold text-orange-500 dark:text-orange-400">
                  ${p.precio.toLocaleString("es-MX")}
                </span>
              </div>

              {/* ⚙️ Acciones */}
              <div className="mt-3 flex gap-2">
                <button
                  className="w-full rounded-md bg-yellow-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-yellow-600 transition"
                  onClick={() => setProductoEdit(p)}
                >
                  Editar
                </button>
                <button
                  className="w-full rounded-md bg-red-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-600 transition"
                  onClick={() => setProductoDelete(p)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 🟢 Modal Agregar */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* ✏️ Modal Editar */}
      {productoEdit && (
        <EditProductModal
          isOpen={!!productoEdit}
          onClose={() => setProductoEdit(null)}
          producto={productoEdit}
        />
      )}

      {/* 🗑️ Confirmación Eliminar */}
      <Dialog
        open={!!productoDelete}
        onClose={() => setProductoDelete(null)}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-xl w-full max-w-sm relative z-10 border border-zinc-200 dark:border-zinc-700">
          <Dialog.Title className="text-lg font-bold text-center mb-4 text-zinc-800 dark:text-zinc-100">
            ¿Eliminar producto?
          </Dialog.Title>
          <p className="text-center text-sm text-zinc-600 dark:text-zinc-300 mb-6">
            Esta acción no se puede deshacer.
          </p>
          <div className="flex justify-center gap-3">
            <button
              className="px-4 py-2 rounded-lg bg-zinc-700 text-white hover:bg-zinc-600 transition text-sm"
              onClick={() => setProductoDelete(null)}
            >
              Cancelar
            </button>
            <button
              className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition text-sm font-semibold"
              onClick={() => {
                if (!productoDelete?.id) return;
                deleteProduct(productoDelete.id, {
                  onSuccess: () => {
                    toast.success("🗑️ Producto eliminado correctamente");
                    setProductoDelete(null);
                  },
                  onError: () => {
                    toast.error("No se pudo eliminar el producto");
                  },
                });
              }}
            >
              Sí, eliminar
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
