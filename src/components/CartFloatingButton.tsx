import { ShoppingCart } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { useCart } from "../context/CartContext";
import CartModal from "./CartModal";

export default function CartFloatingButton() {
  const { cart } = useCart();
  const count = cart.length;

  return (
    <Dialog.Root>
      <Dialog.Trigger
        className="
          fixed bottom-5 right-5 z-50 flex items-center justify-center
          bg-green-600 hover:bg-green-700 text-white
          rounded-full shadow-lg transition active:scale-95
          w-14 h-14
        "
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

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60" />
        <Dialog.Content
          className="
    fixed left-1/2 top-1/2 z-[9999] -translate-x-1/2 -translate-y-1/2
    w-[92vw] max-w-md rounded-2xl border border-zinc-200
    bg-white dark:bg-zinc-900 p-5 shadow-2xl
  "
        >
          <CartModal />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
