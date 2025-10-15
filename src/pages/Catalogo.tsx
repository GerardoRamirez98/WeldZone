import { useMemo, useState } from "react";
import ProductCard from "../components/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import type { Product } from "@/types/products";
import CartFloatingButton from "../components/CartFloatingButton";

export default function Catalogo() {
  const [q, setQ] = useState("");
  const { products, loading, error } = useProducts();

  // 🔎 Filtrar productos según búsqueda
  const filtered: Product[] = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return products;
    return products.filter(
      (p) =>
        p.nombre.toLowerCase().includes(s) ||
        (p.descripcion ?? "").toLowerCase().includes(s)
    );
  }, [q, products]);

  // ⚠️ Error al cargar
  if (error) {
    return (
      <main className="container py-6 text-center text-red-500">
        Error al cargar productos. Intenta de nuevo más tarde.
      </main>
    );
  }

  return (
    <main className="container py-6 relative">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Catálogo</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Productos para soldadura —{" "}
            {loading ? "..." : `${filtered.length} resultado(s)`}
          </p>
        </div>

        <input
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar productos…"
          className="sm:hidden rounded-xl border bg-white px-3 py-2 text-sm outline-none
                     border-zinc-300 text-zinc-900 placeholder:text-zinc-500
                     focus:border-emerald-600
                     dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500"
        />
      </div>

      {/* 🧱 Grilla de productos */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {loading
          ? // 💫 Skeletons
            Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 animate-pulse"
              >
                <div className="aspect-square rounded-lg bg-zinc-200 dark:bg-zinc-800 mb-3"></div>
                <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2"></div>
              </div>
            ))
          : filtered.map((p) => <ProductCard key={p.id} product={p} />)}
      </section>

      {/* 🛒 Botón flotante del carrito */}
      <CartFloatingButton />
    </main>
  );
}
