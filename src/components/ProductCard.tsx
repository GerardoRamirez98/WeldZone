import * as Dialog from "@radix-ui/react-dialog";
import * as Tooltip from "@radix-ui/react-tooltip";
import { ShoppingCart, Info, Tag } from "lucide-react";
import type { Product } from "../types/products";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div
      className="
        group relative rounded-2xl border bg-white p-3 shadow-sm transition 
        border-zinc-200 hover:shadow-md 
        dark:border-zinc-800 dark:bg-zinc-900
      "
    >
      {/* ✅ ETIQUETA NUEVO / OFERTA */}
      {product.etiqueta && (
        <div
          className={`
            absolute left-3 top-3 z-20 flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold text-white shadow-md
            transition-transform duration-300 group-hover:scale-110 animate-[pulse-soft_3s_ease-in-out_infinite]
            ${
              product.etiqueta === "Nuevo"
                ? "bg-gradient-to-r from-blue-500 to-blue-700"
                : "bg-gradient-to-r from-red-500 to-red-700"
            }
          `}
        >
          <Tag className="h-3 w-3" />
          {product.etiqueta}
        </div>
      )}

      {/* 🖼️ IMAGEN DEL PRODUCTO */}
      <div className="aspect-square overflow-hidden rounded-xl">
        {product.imagenUrl ? (
          <img
            src={product.imagenUrl}
            alt={product.nombre}
            className="
              h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]
            "
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-zinc-200 dark:bg-zinc-800 text-zinc-500 text-sm rounded-xl">
            Sin imagen
          </div>
        )}
      </div>

      {/* 📝 INFO DEL PRODUCTO */}
      <div className="mt-3 flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
            {product.nombre}
          </h3>
          <p className="mt-1 text-sm font-bold text-emerald-600 dark:text-emerald-400">
            ${product.precio.toLocaleString("es-MX")} MXN
          </p>
        </div>

        {/* 🧰 BOTONES DE ACCIÓN */}
        <div className="flex items-center gap-2">
          {/* 📜 BOTÓN DE DETALLES */}
          <Dialog.Root>
            <Dialog.Trigger
              className="
                rounded-lg bg-emerald-600/90 p-2 text-white transition 
                hover:bg-emerald-700
              "
            >
              <Info className="h-4 w-4" />
            </Dialog.Trigger>

            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/60" />
              <Dialog.Content
                className="
                  fixed left-1/2 top-1/2 w-[92vw] max-w-lg -translate-x-1/2 -translate-y-1/2 
                  rounded-2xl border bg-white p-5 shadow-2xl
                  border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900
                "
              >
                <Dialog.Title className="text-lg font-semibold text-zinc-900 dark:text-white">
                  {product.nombre}
                </Dialog.Title>

                <div className="mt-3">
                  {product.imagenUrl && (
                    <img
                      src={product.imagenUrl}
                      alt={product.nombre}
                      className="w-full max-h-[400px] object-contain rounded-lg bg-white p-2 dark:bg-zinc-800 transition-all"
                    />
                  )}
                  <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-300">
                    {product.descripcion}
                  </p>
                  <p className="mt-2 text-base font-bold text-emerald-600 dark:text-emerald-400">
                    ${product.precio.toLocaleString("es-MX")} MXN
                  </p>
                </div>

                <div className="mt-5 flex justify-end gap-2">
                  <Dialog.Close
                    className="
                      rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium 
                      text-white hover:bg-emerald-700 transition
                    "
                  >
                    Cerrar
                  </Dialog.Close>
                  <button
                    className="
                      rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium 
                      text-white hover:bg-emerald-700 transition
                    "
                  >
                    Cotizar
                  </button>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>

          {/* 🛒 BOTÓN CARRITO */}
          <Tooltip.Provider delayDuration={150}>
            <Tooltip.Root>
              <Tooltip.Trigger
                className="
                  rounded-lg bg-emerald-600/90 p-2 text-white transition 
                  hover:bg-emerald-700
                "
              >
                <ShoppingCart className="h-4 w-4" />
              </Tooltip.Trigger>
              <Tooltip.Content
                className="
                  rounded-md bg-zinc-800 px-2 py-1 text-xs text-zinc-100 shadow
                "
              >
                Agregar (próximamente)
              </Tooltip.Content>
            </Tooltip.Root>
          </Tooltip.Provider>
        </div>
      </div>
    </div>
  );
}
