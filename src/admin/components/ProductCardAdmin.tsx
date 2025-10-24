import { memo } from "react";
import { FileText, Tag } from "lucide-react";
import type { Product } from "@/types/products";
import * as Tooltip from "@radix-ui/react-tooltip";

type Props = {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
};

function Card({ product: p, onEdit, onDelete }: Props) {
  return (
    <div
      className="group relative rounded-2xl border bg-white p-3 shadow-sm transition 
        border-zinc-200 hover:shadow-md 
        dark:border-zinc-800 dark:bg-zinc-900"
    >
      {p.etiqueta?.nombre && (
        <div
          className="absolute left-3 top-3 z-20 flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold text-white shadow-md
          transition-transform duration-300 group-hover:scale-110 animate-[pulse-soft_3s_ease-in-out_infinite]"
          style={{ backgroundColor: p.etiqueta?.color || "#666" }}
        >
          <Tag className="h-3 w-3" />
          {p.etiqueta?.nombre}
        </div>
      )}

      <div className="aspect-square overflow-hidden rounded-xl relative group">
        {p.imagenUrl ? (
          <img
            src={p.imagenUrl}
            alt={p.nombre}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-zinc-200 dark:bg-zinc-800 text-zinc-500 text-sm rounded-xl">
            Sin imagen
          </div>
        )}

        {p.specFileUrl && (
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
                <FileText className="w-4 h-4 text-white" strokeWidth={2.2} />
              </button>
            </Tooltip.Trigger>
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
        )}
      </div>

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

        <div className="mt-3 flex gap-2">
          <button
            className="w-full rounded-md bg-yellow-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-yellow-600 transition"
            onClick={() => onEdit(p)}
          >
            Editar
          </button>
          <button
            className="w-full rounded-md bg-red-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-600 transition"
            onClick={() => onDelete(p)}
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

const ProductCardAdmin = memo(Card);
export default ProductCardAdmin;

