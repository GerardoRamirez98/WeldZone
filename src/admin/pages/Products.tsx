import { useMemo, useState } from "react";
import AddProductModal from "../components/AddProductModal";
import EditProductModal from "../components/EditProductModal";
import { Dialog } from "@headlessui/react";
import type { Product } from "../../types/products";
import { useProducts, useDeleteProduct } from "../../hooks/useProducts";
import { toast } from "sonner";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useCategorias } from "@/hooks/useCategories";
import { exportProductsPdf } from "@/utils/pdf";
import ProductCardAdmin from "../components/ProductCardAdmin";

export default function Products() {
  const { products, loading, error } = useProducts();
  const { mutate: deleteProduct } = useDeleteProduct();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [productoEdit, setProductoEdit] = useState<Product | null>(null);
  const [productoDelete, setProductoDelete] = useState<Product | null>(null);

  const { data: categorias = [] } = useCategorias();
  const [categoriaId, setCategoriaId] = useState<number | "all">("all");

  const filtered = useMemo(() => {
    if (categoriaId === "all") return products;
    return products.filter(
      (p) => p.categoria?.id === categoriaId || p.categoriaId === categoriaId
    );
  }, [products, categoriaId]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-96 text-zinc-400 dark:text-zinc-500">
        Cargando productos...
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col justify-center items-center h-96 text-red-400 dark:text-red-300">
        <p>Error al cargar productos.</p>
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
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Gestión de Productos</h2>
        <button
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition font-medium"
          onClick={() => setIsAddModalOpen(true)}
        >
          + Agregar
        </button>
      </div>

      {/* Herramientas de exportación */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <label className="text-sm text-zinc-600 dark:text-zinc-300">Categoría:</label>
          <select
            className="px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm"
            value={categoriaId}
            onChange={(e) => {
              const v = e.target.value;
              setCategoriaId(v === "all" ? "all" : Number(v));
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
                categoriaId === "all"
                  ? undefined
                  : categorias.find((c) => c.id === categoriaId)?.nombre;
              const id = toast.loading("Generando PDF...");
              const isMobile =
                typeof navigator !== "undefined" &&
                /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
              const many = filtered.length > 80;
              await exportProductsPdf(filtered, {
                title: "Listado de Productos",
                categoryName: catName,
                includeImages: !(isMobile || many),
                imageMaxDim: isMobile ? 160 : 256,
                imageQuality: isMobile ? 0.6 : 0.75,
                concurrency: isMobile ? 3 : 6,
              });
              toast.success("PDF generado", { id });
            } catch (err) {
              console.error("Error exportando PDF:", err);
              toast.error("No se pudo generar el PDF");
            }
          }}
        >
          Exportar PDF
        </button>
      </div>

      {/* Grid de productos activos */}
      <Tooltip.Provider delayDuration={150}>
        <div className="grid grid-cols-2 gap-6 lg:auto-grid">
          {filtered.map((prod) => (
            <div key={prod.id}>
              <ProductCardAdmin
                product={prod}
                onEdit={setProductoEdit}
                onDelete={setProductoDelete}
              />
            </div>
          ))}
        </div>
      </Tooltip.Provider>

      {/* Modal Agregar */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* Modal Editar */}
      {productoEdit && (
        <EditProductModal
          isOpen={!!productoEdit}
          onClose={() => setProductoEdit(null)}
          producto={productoEdit}
        />
      )}

      {/* Confirmación: Desactivar producto */}
      <Dialog
        open={!!productoDelete}
        onClose={() => setProductoDelete(null)}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-xl w-full max-w-sm relative z-10 border border-zinc-200 dark:border-zinc-700">
          <Dialog.Title className="text-lg font-bold text-center mb-4 text-zinc-800 dark:text-zinc-100">
            ¿Desactivar producto?
          </Dialog.Title>
          <p className="text-center text-sm text-zinc-600 dark:text-zinc-300 mb-6">
            Podrás reactivarlo desde la vista "Productos eliminados".
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
                    toast.success("Producto desactivado");
                    setProductoDelete(null);
                  },
                  onError: () => {
                    toast.error("No se pudo desactivar el producto");
                  },
                });
              }}
            >
              Sí, desactivar
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}



