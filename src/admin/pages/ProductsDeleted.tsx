import { useState, useMemo } from "react";
import type { Product } from "@/types/products";
import { useInactiveProducts, useRestoreProduct, useForceDeleteProduct } from "@/hooks/useProducts";
import { toast } from "sonner";
import * as Tooltip from "@radix-ui/react-tooltip";
import ProductCardAdmin from "../components/ProductCardAdmin";
import ForceDeleteModal from "../components/ForceDeleteModal";
import { useCategorias } from "@/hooks/useCategories";

export default function ProductsDeleted() {
  const { products: inactiveProducts, loading, error } = useInactiveProducts();
  const { mutate: restoreProduct } = useRestoreProduct();
  const { mutate: forceDeleteProduct } = useForceDeleteProduct();

  const [productoForceDelete, setProductoForceDelete] = useState<Product | null>(null);
  const [q, setQ] = useState("");
  const { data: categorias = [] } = useCategorias();
  const [categoriaId, setCategoriaId] = useState<number | "all">("all");

  // Filtrado local solo sobre productos eliminados
  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    let arr = inactiveProducts;
    if (query) {
      arr = arr.filter(
        (p) =>
          p.nombre.toLowerCase().includes(query) ||
          (p.descripcion ?? "").toLowerCase().includes(query),
      );
    }
    if (categoriaId !== "all") {
      arr = arr.filter((p) => p.categoria?.id === categoriaId || p.categoriaId === categoriaId);
    }
    return arr;
  }, [inactiveProducts, q, categoriaId]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-96 text-zinc-400 dark:text-zinc-500">
        Cargando eliminados...
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col justify-center items-center h-96 text-red-400 dark:text-red-300">
        <p>Error al cargar productos eliminados.</p>
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
      <div className="flex flex-col gap-3 mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Productos eliminados</h2>
          <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300">
            {inactiveProducts.length}
          </span>
        </div>
        {/* Controles de filtrado (solo eliminados) */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por nombre o descripción"
            className="flex-1 rounded-md border bg-white px-3 py-2 text-sm outline-none border-zinc-300 text-zinc-900 placeholder:text-zinc-500 focus:border-yellow-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500"
          />
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
        </div>
      </div>

      <Tooltip.Provider delayDuration={150}>
        {inactiveProducts.length === 0 ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">No hay productos eliminados.</p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Sin coincidencias con el filtro.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:auto-grid">
            {filtered.map((prod) => (
              <div key={prod.id}>
                <ProductCardAdmin
                  product={prod}
                  mode="inactive"
                  onEdit={() => {}}
                  onDelete={() => {}}
                  onRestore={(p) => {
                    restoreProduct(p.id, {
                      onSuccess: () => toast.success("Producto reactivado"),
                      onError: () => toast.error("No se pudo reactivar"),
                    });
                  }}
                  onForceDelete={(p) => setProductoForceDelete(p)}
                />
              </div>
            ))}
          </div>
        )}
      </Tooltip.Provider>

      {/* Modal eliminación definitiva */}
      <ForceDeleteModal
        isOpen={!!productoForceDelete}
        onClose={() => setProductoForceDelete(null)}
        onConfirm={(password) => {
          if (!productoForceDelete) return;
          forceDeleteProduct(
            { id: productoForceDelete.id, password },
            {
              onSuccess: () => {
                toast.success("Producto eliminado definitivamente");
                setProductoForceDelete(null);
              },
              onError: () => toast.error("Contraseña inválida o error al eliminar"),
            }
          );
        }}
      />
    </div>
  );
}
