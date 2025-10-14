import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { useCart } from "../context/CartContext";
import CartModal from "./CartModal";

export default function CartFloatingButton() {
  const { cart } = useCart();
  const count = cart.length;
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      {/* 🛒 Botón flotante (oculto cuando el modal está abierto) */}
      <Dialog.Trigger
        className={`
          fixed bottom-6 right-6 z-[1000] flex items-center justify-center
          bg-green-600 hover:bg-green-700 text-white
          rounded-full shadow-lg transition active:scale-95
          w-14 h-14
          ${open ? "opacity-0 pointer-events-none" : "opacity-100"}
        `}
      >
        <ShoppingCart className="w-6 h-6" />
        {count > 0 && (
          <span
            className="
              absolute -top-1 -right-1 bg-red-600 text-white 
              text-xs font-bold w-5 h-5 flex items-center justify-center 
              rounded-full shadow-md
            "
          >
            {count}
          </span>
        )}
      </Dialog.Trigger>

      {/* 💬 Modal del carrito */}
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 z-[999]" />
        <Dialog.Content
          className="
            fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
            w-[92vw] max-w-md rounded-2xl border border-zinc-200
            bg-white dark:bg-zinc-900 p-5 shadow-2xl z-[1001]
          "
        >
          <CartModal />

          {/* Botón para cerrar el modal */}
          <Dialog.Close
            className="
              mt-4 w-full rounded-lg bg-green-600 text-white py-2
              hover:bg-green-700 transition
            "
          >
            Cerrar carrito
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
