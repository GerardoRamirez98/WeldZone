import { useMemo, useState } from "react";
import Header from "./components/Header";
import ProductCard from "./components/ProductCard";
import { products } from "./data/products";
import type { Producto } from "./data/products";

export default function App() {
  const [q, setQ] = useState("");

  const filtered: Producto[] = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return products;
    return products.filter(
      (p) =>
        p.nombre.toLowerCase().includes(s) ||
        p.descripcion.toLowerCase().includes(s)
    );
  }, [q]);

  return (
    <div className="min-h-dvh bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <Header onSearch={setQ} />

      <main className="container py-6">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Catálogo</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Productos para soldadura — {filtered.length} resultado(s)
            </p>
          </div>
          {/* Buscador móvil */}
          <input
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar productos…"
            className="sm:hidden rounded-xl border bg-white px-3 py-2 text-sm outline-none
                       border-zinc-300 text-zinc-900 placeholder:text-zinc-500
                       focus:border-emerald-600
                       dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500"
          />
        </div>

        {/* Grid responsivo */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </section>
      </main>

      <footer className="border-t py-6 text-center text-sm text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800">
        © {new Date().getFullYear()} WeldZone — Todo para el soldador
      </footer>
    </div>
  );
}
