import { Trash2, X, Plus, Minus } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useConfig } from "../hooks/useConfig";
import * as Dialog from "@radix-ui/react-dialog";
import { toast } from "sonner";

export default function CartModal() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const { config } = useConfig(); // 👈 obtenemos la configuración desde backend

  const whatsappNumber = config?.whatsapp?.trim();

  const mensaje =
    `🛒 *¡Nuevo pedido desde WeldZone!*\n\n` +
    cart
      .map(
        (p, i) =>
          `🧰 *${i + 1}. ${p.nombre.toUpperCase()}*\n` +
          `💵 Precio: $${p.precio.toLocaleString("es-MX")} MXN\n` +
          `📦 Cantidad: ${p.cantidad}\n` +
          `💰 Subtotal: $${(p.precio * p.cantidad).toLocaleString("es-MX")} MXN`
      )
      .join("\n\n") +
    `\n\n--------------------------\n` +
    `💸 *Total a pagar:* $${cart
      .reduce((acc, p) => acc + p.precio * p.cantidad, 0)
      .toLocaleString("es-MX")} MXN\n` +
    `--------------------------\n\n` +
    `🚚 *Método de entrega:* A convenir con el vendedor\n` +
    `📞 *Atención personalizada vía WhatsApp*\n\n` +
    `🧾 *Catálogo completo:* https://weldzone.vercel.app/catalogo\n\n` +
    `📲 *Por favor envíame tu nombre y dirección para confirmar tu pedido.*\n\n` +
    `🔧 _Mensaje automático generado desde WeldZone_`;

  const handleSend = () => {
    if (cart.length === 0) {
      toast.warning("Tu carrito está vacío.");
      return;
    }
    if (!whatsappNumber) {
      toast.error("❌ No hay número de WhatsApp configurado.");
      return;
    }

    // ✅ Usa la API larga (mantiene emojis y saltos)
    window.open(
      `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(
        mensaje
      )}`,
      "_blank"
    );

    clearCart();
  };

  return (
    <div className="space-y-4 text-zinc-800 dark:text-zinc-100">
      {/* 🔹 Encabezado */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Carrito de compra</h2>
        <Dialog.Close>
          <X className="w-5 h-5 text-zinc-600 dark:text-zinc-300 hover:text-red-500 transition" />
        </Dialog.Close>
      </div>

      {/* 🔹 Contenido */}
      {cart.length === 0 ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Tu carrito está vacío.
        </p>
      ) : (
        <>
          {/* 🧾 Lista de productos */}
          <ul className="divide-y divide-zinc-200 dark:divide-zinc-700 max-h-[320px] overflow-y-auto">
            {cart.map((p) => (
              <li
                key={p.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 text-sm"
              >
                <div className="flex flex-col">
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">
                    {p.nombre}
                  </p>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    ${p.precio.toLocaleString("es-MX")} MXN c/u
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Subtotal:{" "}
                    <span className="font-semibold text-yellow-600 dark:text-yellow-400">
                      ${(p.precio * p.cantidad).toLocaleString("es-MX")} MXN
                    </span>
                  </p>
                </div>

                {/* 🔹 Controles de cantidad */}
                <div className="flex items-center gap-2 mt-2 sm:mt-0">
                  <label
                    onClick={() => updateQuantity(p.id, p.cantidad - 1)}
                    className="p-1 rounded-md border transition 
                      border-zinc-300 bg-zinc-100 hover:bg-zinc-200 
                      dark:border-zinc-600 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                  >
                    <Minus className="w-4 h-4 text-zinc-800 dark:text-zinc-100" />
                  </label>

                  <span className="font-semibold text-zinc-900 dark:text-zinc-100 w-5 text-center">
                    {p.cantidad}
                  </span>

                  <label
                    onClick={() => updateQuantity(p.id, p.cantidad + 1)}
                    className="p-1 rounded-md border transition 
                      border-zinc-300 bg-zinc-100 hover:bg-zinc-200 
                      dark:border-zinc-600 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                  >
                    <Plus className="w-4 h-4 text-zinc-800 dark:text-zinc-100" />
                  </label>

                  {/* 🗑️ Eliminar */}
                  <label
                    onClick={() => removeFromCart(p.id)}
                    className="ml-2 text-red-500 hover:text-red-600 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </label>
                </div>
              </li>
            ))}
          </ul>

          {/* 🔹 Total general */}
          <div className="pt-3 border-t border-zinc-200 dark:border-zinc-700">
            <p className="font-semibold text-right">
              Total:{" "}
              <span className="text-yellow-600 dark:text-yellow-400">
                $
                {cart
                  .reduce((acc, p) => acc + p.precio * p.cantidad, 0)
                  .toLocaleString("es-MX")}{" "}
                MXN
              </span>
            </p>
          </div>

          {/* 🔹 Botones inferiores */}
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-between mt-3">
            <label
              onClick={clearCart}
              className="w-full sm:w-auto bg-zinc-700 hover:bg-zinc-800 
                         text-white py-2 px-4 rounded-lg font-medium transition"
            >
              Vaciar carrito
            </label>

            <label
              onClick={handleSend}
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 
                         text-white py-2 px-4 rounded-lg font-medium transition"
            >
              Enviar pedido por WhatsApp
            </label>
          </div>
        </>
      )}
    </div>
  );
}
