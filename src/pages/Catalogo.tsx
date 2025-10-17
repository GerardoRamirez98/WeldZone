import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "../components/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import type { Product } from "@/types/products";
import CartFloatingButton from "../components/CartFloatingButton";
import SidebarCategorias from "../components/SidebarCategorias";

export default function Catalogo() {
  const [q, setQ] = useState("");
  const [categorias, setCategorias] = useState<
    { id: number; nombre: string }[]
  >([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<
    number | null
  >(null);

  // 🧠 Siempre al montar o recargar, forzamos la selección "Todas"
  useEffect(() => {
    setCategoriaSeleccionada(null);
  }, []);

  const { products, loading, error } = useProducts();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  // ⚙️ Cargar categorías
  useEffect(() => {
    fetch(`${API_URL}/config/categorias`)
      .then((r) => r.json())
      .then(setCategorias)
      .catch((err) => console.error("❌ Error al cargar categorías:", err));
  }, [API_URL]);

  // 🔎 Filtrar productos según búsqueda y categoría
  const filtered: Product[] = useMemo(() => {
    const s = q.trim().toLowerCase();
    return products.filter((p) => {
      const matchesSearch =
        !s ||
        p.nombre.toLowerCase().includes(s) ||
        (p.descripcion ?? "").toLowerCase().includes(s);
      const matchesCategory =
        categoriaSeleccionada === null ||
        p.categoriaId === categoriaSeleccionada;
      return matchesSearch && matchesCategory;
    });
  }, [q, products, categoriaSeleccionada]);

  // 📊 Filtrar categorías con productos disponibles
  const categoriasConProductos = useMemo(() => {
    // Creamos un conteo por categoría
    const counts = products.reduce((acc: Record<number, number>, p) => {
      if (p.categoriaId) {
        acc[p.categoriaId] = (acc[p.categoriaId] || 0) + 1;
      }
      return acc;
    }, {});

    // Devolvemos solo las que tienen productos (>0)
    return categorias.filter((cat) => counts[cat.id] > 0);
  }, [categorias, products]);

  // 📌 Nombre de la categoría actual
  const categoriaActual =
    categoriaSeleccionada === null
      ? null
      : categoriasConProductos.find((c) => c.id === categoriaSeleccionada);

  if (error) {
    return (
      <main className="container py-6 text-center text-red-500">
        Error al cargar productos. Intenta de nuevo más tarde.
      </main>
    );
  }

  return (
    <main className="container py-6 relative flex flex-col md:flex-row gap-6">
      {/* 📂 Sidebar con encabezado */}
      <SidebarCategorias
        categorias={categoriasConProductos}
        categoriaSeleccionada={categoriaSeleccionada}
        onSelect={setCategoriaSeleccionada}
        totalProductos={filtered.length}
        categoriaActualNombre={categoriaActual?.nombre || null}
        loading={loading}
      />

      {/* 🧱 Contenido principal */}
      <div className="flex-1">
        {/* 🔍 Campo de búsqueda móvil */}
        <input
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar productos…"
          className="sm:hidden mb-4 rounded-xl border bg-white px-3 py-2 text-sm outline-none
                     border-zinc-300 text-zinc-900 placeholder:text-zinc-500
                     focus:border-yellow-500
                     dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500"
        />

        {/* ✨ Animación de grilla */}
        <AnimatePresence mode="wait">
          <motion.section
            key={categoriaSeleccionada ?? "all"}
            initial="hidden"
            animate="show"
            exit="hidden"
            variants={{
              hidden: { opacity: 0, y: 15 },
              show: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.4,
                  staggerChildren: 0.06,
                },
              },
            }}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 animate-pulse"
                  >
                    <div className="aspect-square rounded-lg bg-zinc-200 dark:bg-zinc-800 mb-3"></div>
                    <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2"></div>
                  </div>
                ))
              : filtered.map((p) => (
                  <motion.div
                    key={p.id}
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      show: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.25 }}
                  >
                    <ProductCard product={p} />
                  </motion.div>
                ))}
          </motion.section>
        </AnimatePresence>
      </div>

      {/* 🛒 Botón flotante del carrito */}
      <CartFloatingButton />
    </main>
  );
}
