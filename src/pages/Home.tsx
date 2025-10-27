import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import bgImage from "../assets/welder-home.png";
import { useConfig } from "@/hooks/useConfig";
import { useCategorias } from "@/hooks/useCategories";
import { useProducts } from "@/hooks/useProducts";
import ProductCard from "@/components/ProductCard";
import ProductSkeleton from "@/components/ProductSkeleton";

export default function Home() {
  useEffect(() => {
    document.title = "Inicio | WeldZone";
  }, []);

  const { config } = useConfig();
  const { products, loading } = useProducts();
  const { data: categorias = [] } = useCategorias();

  const whatsappHref = config?.whatsapp
    ? `https://wa.me/${config.whatsapp.replace(
        /[^\d]/g,
        ""
      )}?text=${encodeURIComponent("Hola, me interesa cotizar productos.")}`
    : undefined;

  const featured = useMemo(() => {
    const sorted = [...products].sort((a, b) => {
      const ta = a.createdAt ? Date.parse(a.createdAt) : 0;
      const tb = b.createdAt ? Date.parse(b.createdAt) : 0;
      return tb - ta;
    });
    return sorted.slice(0, 8);
  }, [products]);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      {/* Hero */}
      <section
        className="relative w-full overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/75 via-zinc-950/70 to-yellow-900/20" />
        <div className="absolute inset-y-0 left-0 w-full md:w-1/2 bg-gradient-to-r from-black/70 to-transparent" />

        <div className="relative container mx-auto px-6 py-24 md:py-36 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]">
              Potencia para el soldador
              <span className="block text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.7)]">
                Herramientas, insumos y asesoría técnica
              </span>
            </h1>
            <p className="mt-4 text-lg md:text-xl text-zinc-100 max-w-2xl">
              Equipa tu taller con productos de calidad y el apoyo de expertos.
              Compra fácil y coordina tu recogida en tienda.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/catalogo"
                className="inline-block w-full sm:w-auto text-center bg-yellow-500 hover:bg-yellow-400 text-zinc-900 font-semibold py-3 px-6 rounded-xl transition-colors hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
                aria-label="Ver catálogo"
              >
                Ver catálogo
              </Link>
              {whatsappHref && (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block w-full sm:w-auto text-center bg-white dark:bg-white !text-black dark:!text-black border border-zinc-200 dark:border-zinc-700 hover:bg-white hover:!text-black font-semibold py-3 px-6 rounded-xl transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
                >
                  Cotizar por WhatsApp
                </a>
              )}
            </div>
          </div>

          <ul className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4 text-zinc-100">
            {[
              {
                title: "Asesoría técnica",
                desc: "Te ayudamos a elegir el equipo ideal",
              },
              {
                title: "Retiro en tienda",
                desc: "Coordina y recoge tu pedido",
              },
              {
                title: "Garantía real",
                desc: "Soporte y repuestos disponibles",
              },
            ].map((f) => (
              <li
                key={f.title}
                className="rounded-2xl bg-zinc-900/70 backdrop-blur border border-yellow-500/20 px-6 py-5"
              >
                <h3 className="text-lg font-bold text-yellow-400">{f.title}</h3>
                <p className="text-zinc-300 text-sm">{f.desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Categorías destacadas (dinámicas) */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">
          Categorías destacadas
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(() => {
            const counts = products.reduce((acc: Record<number, number>, p) => {
              if (p.categoriaId)
                acc[p.categoriaId] = (acc[p.categoriaId] || 0) + 1;
              return acc;
            }, {} as Record<number, number>);
            const featuredCats = categorias
              .filter((c) => counts[c.id] > 0)
              .sort((a, b) => (counts[b.id] || 0) - (counts[a.id] || 0))
              .slice(0, 4);

            return featuredCats.map((c) => (
              <Link
                key={c.id}
                to={{ pathname: "/catalogo", search: `?cat=${c.id}` }}
                className="rounded-xl p-6 border border-zinc-200 dark:border-zinc-800 hover:border-yellow-500/50 hover:shadow-[0_0_18px_rgba(250,204,21,0.15)] transition-colors"
              >
                <span className="block text-base sm:text-lg font-semibold capitalize leading-tight break-words hyphens-auto line-clamp-2">
                  {c.nombre}
                </span>
                <span className="text-zinc-500 text-sm">
                  {counts[c.id]} producto(s)
                </span>
              </Link>
            ));
          })()}
        </div>
      </section>

      {/* Productos destacados */}
      <section className="container mx-auto px-6 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold">
            Productos destacados
          </h2>
          <Link
            to="/catalogo"
            className="hidden sm:inline-block text-sm font-semibold text-yellow-600 dark:text-yellow-400 hover:underline"
          >
            Ver catálogo
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className={i >= 4 ? "hidden sm:block" : ""}>
                  <ProductSkeleton />
                </div>
              ))
            : featured.map((p, i) => (
                <div key={p.id} className={i >= 4 ? "hidden sm:block" : ""}>
                  <ProductCard product={p} />
                </div>
              ))}
        </div>
        <div className="sm:hidden mt-6">
          <Link
            to="/catalogo"
            className="inline-block w-full text-center border border-yellow-500/60 text-yellow-600 dark:text-yellow-400 hover:text-zinc-900 hover:bg-yellow-400 font-semibold py-2.5 px-5 rounded-xl"
          >
            Ver catálogo
          </Link>
        </div>
      </section>

      {/* CTA final */}
      <section className="container mx-auto px-6 pb-20">
        <div className="rounded-2xl p-8 md:p-10 bg-gradient-to-br from-yellow-500/10 to-transparent border border-yellow-500/20">
          <h3 className="text-xl md:text-2xl font-bold">
            ¿Listo para optimizar tu taller?
          </h3>
          <p className="text-zinc-600 dark:text-zinc-300">
            Comienza revisando el catálogo o escríbenos para una cotización
            rápida.
          </p>
          <div className="mt-5 flex gap-3">
            <Link
              to="/catalogo"
              className="inline-block w-full sm:w-auto text-center bg-yellow-500 hover:bg-yellow-600 text-zinc-900 font-semibold py-2.5 px-5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
            >
              Ver catálogo
            </Link>
            {whatsappHref && (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-full sm:w-auto text-center bg-white dark:bg-white !text-black dark:!text-black border border-zinc-200 dark:border-zinc-700 hover:bg-white hover:!text-black font-semibold py-2.5 px-5 rounded-xl shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
              >
                Cotizar por WhatsApp
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
