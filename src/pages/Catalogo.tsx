import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "../components/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import type { Product } from "@/types/products";
import CartFloatingButton from "../components/CartFloatingButton";
import SidebarCategorias from "../components/SidebarCategorias";
import { useCategorias } from "@/hooks/useCategories";
import { exportProductsPdf } from "@/utils/pdf";
import { toast } from "sonner";

export default function Catalogo() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const catParam = searchParams.get("cat");
  const minParam = searchParams.get("min");
  const maxParam = searchParams.get("max");
  const promoParam = searchParams.get("promo");
  const { data: categorias = [], isLoading: loadingCategorias } = useCategorias();
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<number | null>(() => {
    const n = catParam ? Number(catParam) : NaN;
    return Number.isFinite(n) ? n : null;
  });

  const { products, loading, error } = useProducts();
  const priceMin = useMemo(() => (minParam ? Number(minParam) : null), [minParam]);
  const priceMax = useMemo(() => (maxParam ? Number(maxParam) : null), [maxParam]);
  const selectedPromoId = useMemo(() => {
    const n = promoParam ? Number(promoParam) : NaN;
    return Number.isFinite(n) ? n : null;
  }, [promoParam]);

  // Filtrar productos según búsqueda y categoría
  const filtered: Product[] = useMemo(() => {
    const s = q.trim().toLowerCase();
    return products.filter((p) => {
      const matchesSearch = !s || p.nombre.toLowerCase().includes(s) || (p.descripcion ?? "").toLowerCase().includes(s);
      const matchesCategory = categoriaSeleccionada === null || p.categoriaId === categoriaSeleccionada;
      const matchesPrice = (priceMin === null || p.precio >= priceMin) && (priceMax === null || p.precio <= priceMax);
      const tagId = p.etiquetaId ?? (p.etiqueta ? p.etiqueta.id : null);
      const matchesPromo = selectedPromoId === null || tagId === selectedPromoId;
      return matchesSearch && matchesCategory && matchesPrice && matchesPromo;
    });
  }, [q, products, categoriaSeleccionada, priceMin, priceMax, selectedPromoId]);

  // Filtrar categorías con productos disponibles
  const categoriasConProductos = useMemo(() => {
    const counts = products.reduce((acc: Record<number, number>, p) => {
      if (p.categoriaId) acc[p.categoriaId] = (acc[p.categoriaId] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
    return categorias.filter((cat) => counts[cat.id] > 0);
  }, [categorias, products]);

  const categoriaActual = categoriaSeleccionada === null ? null : categoriasConProductos.find((c) => c.id === categoriaSeleccionada);

  // Tipos de promoción (etiquetas) disponibles dentro de la categoría actual
  const promociones = useMemo(() => {
    const map = new Map<number, { id: number; nombre: string; count: number }>();
    const base = categoriaSeleccionada === null ? products : products.filter((p) => p.categoriaId === categoriaSeleccionada);
    for (const p of base) {
      const e = p.etiqueta ?? (p.etiquetaId ? { id: p.etiquetaId, nombre: "Etiqueta", color: "#999" } as any : null);
      if (!e || !e.id) continue;
      const current = map.get(e.id) ?? { id: e.id, nombre: e.nombre, count: 0 };
      current.count += 1;
      map.set(e.id, current);
    }
    return Array.from(map.values()).sort((a, b) => a.nombre.localeCompare(b.nombre));
  }, [products, categoriaSeleccionada]);

  const handleExport = async () => {
    const toastId = toast.loading("Generando PDF...");
    try {
      // Heurísticas de rendimiento (mobile y catálogos grandes)
      const isMobile = typeof navigator !== "undefined" && /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      const many = filtered.length > 80; // umbral para acelerar
      await exportProductsPdf(filtered, {
        title: "Listado de productos",
        includeImages: !(isMobile || many),
        imageMaxDim: isMobile ? 160 : 256,
        imageQuality: isMobile ? 0.6 : 0.75,
        concurrency: isMobile ? 3 : 6,
      });
      toast.success("PDF generado", { id: toastId });
    } catch (e) {
      console.error("No se pudo exportar el PDF", e);
      toast.error("No se pudo generar el PDF", { id: toastId });
    }
  };

  if (error) {
    return (
      <main className="container py-6 text-center text-red-500">Error al cargar productos. Intenta de nuevo más tarde.</main>
    );
  }

  return (
    <main className="container py-6 relative flex flex-col md:flex-row gap-6">
      <SidebarCategorias
        categorias={categoriasConProductos}
        categoriaSeleccionada={categoriaSeleccionada}
        onSelect={(id) => {
          setCategoriaSeleccionada(id);
          const params = new URLSearchParams(searchParams);
          if (id === null) params.delete("cat");
          else params.set("cat", String(id));
          setSearchParams(params, { replace: true });
        }}
        totalProductos={filtered.length}
        categoriaActualNombre={categoriaActual?.nombre || null}
        loading={loading || loadingCategorias}
        onExport={filtered.length > 0 ? handleExport : undefined}
        priceMin={priceMin}
        priceMax={priceMax}
        onApplyPrice={(min, max) => {
          const params = new URLSearchParams(searchParams);
          if (min == null || Number.isNaN(min)) params.delete("min"); else params.set("min", String(min));
          if (max == null || Number.isNaN(max)) params.delete("max"); else params.set("max", String(max));
          setSearchParams(params, { replace: true });
        }}
        promociones={promociones}
        selectedPromoId={selectedPromoId}
        onSelectPromo={(id) => {
          const params = new URLSearchParams(searchParams);
          if (id === null) params.delete("promo"); else params.set("promo", String(id));
          setSearchParams(params, { replace: true });
        }}
      />

      <div className="flex-1">
        {/* Barra de acciones móvil: buscador + descargar PDF */}
        <div className="sm:hidden mb-4 flex items-center gap-2">
          <input
            aria-label="Buscar productos"
            value={q}
            onChange={(e) => {
              const value = e.target.value;
              const params = new URLSearchParams(searchParams);
              if (value.trim()) params.set("q", value);
              else params.delete("q");
              setSearchParams(params, { replace: true });
            }}
            placeholder="Buscar productos."
            className="flex-1 rounded-xl border bg-white px-3 py-2 text-sm outline-none border-zinc-300 text-zinc-900 placeholder:text-zinc-500 focus:border-yellow-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500"
          />
          {filtered.length > 0 && (
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center justify-center h-9 px-3 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 active:scale-[.99] transition"
            >
              Descargar PDF
            </button>
          )}
        </div>

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
                transition: { duration: 0.4, staggerChildren: 0.06 },
              },
            }}
            className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 animate-pulse">
                    <div className="aspect-square rounded-lg bg-zinc-200 dark:bg-zinc-800 mb-3"></div>
                    <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2"></div>
                  </div>
                ))
                : filtered.map((p) => (
                  <motion.div key={p.id} variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }} transition={{ duration: 0.25 }}>
                    <ProductCard product={p} showAddButton />
                  </motion.div>
                ))}
          </motion.section>
        </AnimatePresence>
      </div>

      <CartFloatingButton />
    </main>
  );
}
