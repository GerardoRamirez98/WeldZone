import { Trash2, X, Plus, Minus } from "lucide-react";
import { useCart } from "../context/CartContext";
import type { CartItem } from "../context/CartContext";
import { useConfig } from "../hooks/useConfig";
import * as Dialog from "@radix-ui/react-dialog";
import { toast } from "sonner";
import { useState } from "react";
import { exportOrderReceiptPdf } from "@/utils/pdf";

function buildOrderMessage(cart: CartItem[], name: string, reference: string) {
  const total = cart.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
  const now = new Date();
  const fecha = new Intl.DateTimeFormat("es-MX", { dateStyle: "medium", timeStyle: "short" }).format(now);
  const header =
    `*Nuevo pedido desde WeldZone*\n` +
    `Folio: ${reference}\n` +
    `Fecha: ${fecha}\n` +
    `Cliente: ${name?.trim() || "Cliente"}\n\n`;
  const lines = cart
    .map(
      (p, i) =>
        `${i + 1}. ${p.nombre.toUpperCase()}\n` +
        `   Precio: $${p.precio.toLocaleString("es-MX")} MXN\n` +
        `   Cantidad: ${p.cantidad}\n` +
        `   Subtotal: $${(p.precio * p.cantidad).toLocaleString("es-MX")} MXN`
    )
    .join("\n\n");
  const footer =
    `\n\n--------------------------\n` +
    `Total a pagar: $${total.toLocaleString("es-MX")} MXN\n` +
    `--------------------------\n\n` +
    `Entrega: Recolección en tienda (coordinamos día y hora)\n` +
    `Atención personalizada vía WhatsApp\n\n` +
    `Catálogo completo: https://weldzone.vercel.app/catalogo\n\n` +
    `Por favor envíame tu dirección para confirmar tu pedido.\n\n` +
    `_Mensaje automático generado desde WeldZone_`;
  return header + lines + footer;
}

export default function CartModal() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const { config } = useConfig(); // 👈 obtenemos la configuración desde backend

  const whatsappNumber = config?.whatsapp?.trim();
  const [customerName] = useState("");
  const [nameDialogOpen, setNameDialogOpen] = useState(false);
  const [tempName, setTempName] = useState("");

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
    `🚚 *Entrega:* Recoleccion en tienda (coordinamos dia y hora)\n` +
    `📞 *Atención personalizada vía WhatsApp*\n\n` +
    `🧾 *Catálogo completo:* https://weldzone.vercel.app/catalogo\n\n` +
    `📲 *Por favor envíame tu nombre y dirección para confirmar tu pedido.*\n\n` +
    `🔧 _Mensaje automático generado desde WeldZone_`;

  const handleSendLegacy = () => {
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
  // marcar como usado (legacy)
  void handleSendLegacy;

  // Nuevo flujo: genera folio y comprobante PDF, e incluye el folio en el mensaje
  const handleSend = async (providedName?: string) => {
    if (cart.length === 0) {
      toast.warning("Tu carrito esta vacio.");
      return;
    }
    if (!whatsappNumber) {
      toast.error("No hay numero de WhatsApp configurado.");
      return;
    }

    const snapshot = cart.map((p) => ({ nombre: p.nombre, precio: p.precio, cantidad: p.cantidad })) as CartItem[];
    const name = (providedName ?? customerName ?? "").trim();
    const reference = (() => {
      const d = new Date();
      const pad = (n: number) => String(n).padStart(2, "0");
      const ymd = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
      const rnd = Math.random().toString(36).slice(2, 6).toUpperCase();
      return `WZ-${ymd}-${rnd}`;
    })();

    const mensaje = buildOrderMessage(snapshot, name, reference);

    // Abrimos WhatsApp primero para evitar bloqueos de popup
    window.open(
      `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(mensaje)}`,
      "_blank"
    );

    try {
      const id = toast.loading("Generando comprobante en PDF...");
      await exportOrderReceiptPdf(snapshot, {
        reference,
        customerName: name || "Cliente",
        date: new Date(),
      });
      toast.success("Comprobante descargado", { id });
    } catch (e) {
      console.error(e);
      toast.error("No se pudo generar el comprobante PDF");
    }

    clearCart();
  };

  return (
    <div className="space-y-4 text-zinc-800 dark:text-zinc-100">
      {/* 🔹 Encabezado */}
      <div className="flex justify-between items-center">
        <Dialog.Title className="text-lg font-semibold">Carrito de compra</Dialog.Title>
        <Dialog.Close>
          <X className="w-5 h-5 text-zinc-600 dark:text-zinc-300 hover:text-red-500 transition" />
        </Dialog.Close>
      </div>
      <Dialog.Description className="sr-only">
        Revisa los productos en tu carrito, ajusta cantidades o elimina artículos y envía tu pedido por WhatsApp.
      </Dialog.Description>

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
              onClick={() => setNameDialogOpen(true)}
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 
                         text-white py-2 px-4 rounded-lg font-medium transition"
            >
              Enviar pedido por WhatsApp
            </label>
          </div>
        </>
      )}

      {/* Prompt estilizado para capturar nombre (opcional) */}
      <Dialog.Root open={nameDialogOpen} onOpenChange={setNameDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[1105]" />
          <Dialog.Content
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[1110]
                       w-[92vw] max-w-sm rounded-xl border border-zinc-200 dark:border-zinc-700
                       bg-white dark:bg-zinc-900 p-5 shadow-2xl"
          >
            <Dialog.Title className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              Ingresa tu nombre (opcional)
            </Dialog.Title>
            <Dialog.Description className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Aparecerá en el comprobante PDF y en el mensaje de WhatsApp.
            </Dialog.Description>

            <input
              autoFocus
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              placeholder="Ej. Juan Pérez"
              className="mt-4 w-full rounded-lg border bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:border-emerald-600"
            />

            <div className="mt-4 flex justify-end gap-2">
              <Dialog.Close
                onClick={() => {
                  setNameDialogOpen(false);
                  handleSend("");
                }}
                className="px-3 h-9 rounded-md text-sm font-medium bg-zinc-200 hover:bg-zinc-300 text-zinc-800 dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600"
              >
                Omitir
              </Dialog.Close>
              <Dialog.Close
                onClick={() => {
                  const n = tempName.trim();
                  setNameDialogOpen(false);
                  handleSend(n);
                  setTempName("");
                }}
                className="px-4 h-9 rounded-md text-sm font-semibold bg-green-600 hover:bg-green-700 text-white"
              >
                Continuar
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}



