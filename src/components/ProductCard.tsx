import * as Dialog from "@radix-ui/react-dialog";
import { ShoppingCart, FileText, Tag, Plus, Minus } from "lucide-react";
import type { Product } from "../types/products";
import { useCart } from "../context/CartContext";
import { useState, useEffect } from "react";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [open, setOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // 🧠 Oscurecer fondo al abrir modal
  useEffect(() => {
    if (open) document.body.classList.add("modal-open");
    else document.body.classList.remove("modal-open");
  }, [open]);

  // ⚡ Precarga la imagen grande
  useEffect(() => {
    if (product.imagenUrl) {
      const img = new Image();
      img.src =
        product.imagenUrl.replace("/object/public/", "/render/image/public/") +
        "?width=800&quality=80&resize=contain";
    }
  }, [product.imagenUrl]);

  // 💡 Skeleton loader suave (fallback)
  const SkeletonImage = () => (
    <div className="h-full w-full rounded-xl bg-gradient-to-r from-zinc-200 via-zinc-300 to-zinc-200 dark:from-zinc-800 dark:via-zinc-700 dark:to-zinc-800 animate-[pulse-soft_1.5s_ease-in-out_infinite]" />
  );

  // 🔗 URL optimizada desde Supabase render endpoint
  const baseRenderUrl = product.imagenUrl
    ? product.imagenUrl.replace("/object/public/", "/render/image/public/")
    : "";

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <div
          className="group relative rounded-2xl border bg-white p-3 shadow-sm transition 
          border-zinc-200 hover:shadow-md hover:scale-[1.01]
          dark:border-zinc-800 dark:bg-zinc-900 cursor-pointer"
        >
          {/* 🏷️ Etiqueta */}
          {product.etiqueta && (
            <div
              className="absolute left-3 top-3 z-20 flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold text-white shadow-md
               transition-transform duration-300 group-hover:scale-110 animate-[pulse-soft_3s_ease-in-out_infinite]"
              style={{
                backgroundColor: product.etiqueta?.color || "#777",
              }}
            >
              <Tag className="h-3 w-3" />
              {product.etiqueta?.nombre}
            </div>
          )}

          {/* 🖼️ Imagen con blur-up progresivo */}
          <div className="relative aspect-square overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
            {!imageLoaded && <SkeletonImage />}

            {/* Miniatura borrosa (blur-up) */}
            {product.imagenUrl && (
              <img
                src={`${product.imagenUrl.replace(
                  "/object/public/",
                  "/render/image/public/"
                )}?width=30&quality=5&resize=contain`}
                className="absolute inset-0 w-full h-full object-contain blur-lg scale-110"
                aria-hidden="true"
              />
            )}

            {/* Imagen final optimizada sin recorte */}
            {product.imagenUrl ? (
              <img
                src={`${product.imagenUrl.replace(
                  "/object/public/",
                  "/render/image/public/"
                )}?width=400&quality=70&resize=contain`}
                alt={product.nombre}
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
                className={`relative z-10 max-h-full max-w-full object-contain transition-all duration-700 ease-out group-hover:scale-[1.02] ${
                  imageLoaded ? "blur-0 opacity-100" : "blur-md opacity-70"
                }`}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-zinc-500 text-sm">
                Sin imagen
              </div>
            )}
          </div>

          {/* 📝 Info */}
          <div className="mt-3">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white line-clamp-1">
              {product.nombre}
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-3">
              {product.descripcion || "Sin descripción"}...
            </p>
            <p className="mt-1 text-sm font-bold text-orange-500 dark:text-orange-400">
              ${product.precio.toLocaleString("es-MX")} MXN
            </p>
          </div>
        </div>
      </Dialog.Trigger>

      {/* 🟢 Modal de detalles */}
      {open && (
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-all" />
          <Dialog.Content
            className="fixed left-1/2 top-1/2 w-[92vw] max-w-lg -translate-x-1/2 -translate-y-1/2 
    rounded-2xl border bg-white p-5 shadow-2xl border-zinc-200 
    dark:border-zinc-800 dark:bg-zinc-900"
          >
            {/* ♿️ Accesibilidad para Radix */}
            <Dialog.Title className="sr-only">
              Detalles del producto
            </Dialog.Title>
            <Dialog.Description className="sr-only">
              Información detallada del producto seleccionado, incluyendo
              imagen, descripción y precio.
            </Dialog.Description>

            {/* 🖼️ Imagen grande */}
            <div className="relative">
              {product.imagenUrl && (
                <img
                  src={`${baseRenderUrl}?width=800&quality=80&resize=contain`}
                  alt={product.nombre}
                  className="w-full max-h-[400px] object-contain rounded-lg bg-white p-2 dark:bg-zinc-800"
                />
              )}

              {/* 🟨 Ficha técnica */}
              {product.specFileUrl && (
                <label
                  onClick={() =>
                    window.open(
                      `https://docs.google.com/viewer?url=${encodeURIComponent(
                        product.specFileUrl as string
                      )}&embedded=true`,
                      "_blank"
                    )
                  }
                  className="absolute bottom-3 right-3 z-20 flex items-center justify-center
          w-10 h-10 rounded-full bg-yellow-500 hover:bg-yellow-400 
          shadow-md transition active:scale-95 hover:shadow-[0_0_10px_2px_rgba(255,213,0,0.6)]
          animate-[pulse-soft_3s_ease-in-out_infinite]"
                >
                  <FileText className="w-5 h-5 text-white" strokeWidth={2.2} />
                </label>
              )}
            </div>

            {/* Info modal */}
            <h2 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-white">
              {product.nombre}
            </h2>
            <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
              {product.descripcion || "Sin descripción disponible."}
            </p>
            <p className="mt-2 text-base font-bold text-yellow-600 dark:text-yellow-400">
              ${product.precio.toLocaleString("es-MX")} MXN
            </p>

            {/* Cantidad */}
            <div className="mt-4 flex items-center gap-3">
              <label
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-2 rounded-md border transition 
        border-zinc-300 bg-zinc-100 hover:bg-zinc-200 
        dark:border-zinc-600 dark:bg-zinc-800 dark:hover:bg-zinc-700 
        shadow-sm active:scale-95 cursor-pointer"
              >
                <Minus className="w-4 h-4 text-zinc-800 dark:text-zinc-100" />
              </label>

              <span className="font-semibold text-lg text-zinc-900 dark:text-zinc-100">
                {quantity}
              </span>

              <label
                onClick={() => setQuantity((q) => q + 1)}
                className="p-2 rounded-md border transition 
        border-zinc-300 bg-zinc-100 hover:bg-zinc-200 
        dark:border-zinc-600 dark:bg-zinc-800 dark:hover:bg-zinc-700 
        shadow-sm active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-zinc-800 dark:text-zinc-100" />
              </label>
            </div>

            {/* Total */}
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Total:{" "}
              <span className="font-semibold text-yellow-600 dark:text-yellow-400">
                ${(product.precio * quantity).toLocaleString("es-MX")} MXN
              </span>
            </p>

            {/* Botones */}
            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <label
                onClick={() => addToCart(product, quantity)}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 
        text-white px-3 py-2 rounded-lg text-sm font-medium transition cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" /> Agregar al carrito
              </label>

              <Dialog.Close
                className="rounded-lg bg-zinc-800 px-3 py-2 text-sm font-medium 
        text-white hover:bg-zinc-700 transition"
              >
                Cerrar
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      )}
    </Dialog.Root>
  );
}
