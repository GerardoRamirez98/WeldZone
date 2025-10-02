import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import type { Producto } from "../../data/products";

interface RestockModalProps {
  isOpen: boolean;
  onClose: () => void;
  producto: Producto | null;
  onRestock: (id: number, nuevoStock: number) => void;
}

export default function RestockModal({
  isOpen,
  onClose,
  producto,
  onRestock,
}: RestockModalProps) {
  const [nuevoStock, setNuevoStock] = useState<number>(0);

  // Estados de confirmación
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  useEffect(() => {
    if (producto) {
      setNuevoStock(producto.stock);
    }
  }, [producto]);

  const handleSave = () => {
    if (producto) {
      onRestock(producto.id, nuevoStock);
    }
    onClose();
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={() => setShowCancelConfirm(true)}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-xl w-full max-w-sm relative z-10">
          <Dialog.Title className="text-lg font-bold text-center mb-4">
            Reabastecer producto
          </Dialog.Title>

          {producto && (
            <div className="text-center mb-4">
              <p className="font-semibold">{producto.nombre}</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Stock actual: {producto.stock}
              </p>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm mb-1">Nuevo stock</label>
            <input
              type="number"
              value={nuevoStock}
              onChange={(e) => setNuevoStock(Number(e.target.value))}
              className="w-full p-2 border-b-2 border-zinc-300 dark:border-zinc-600 bg-transparent focus:border-yellow-500 outline-none"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              className="px-4 py-2 bg-zinc-700 text-white rounded-lg"
              onClick={() => setShowCancelConfirm(true)}
            >
              Cancelar
            </button>
            <button
              className="px-4 py-2 bg-yellow-500 text-black rounded-lg font-semibold"
              onClick={() => setShowSaveConfirm(true)}
            >
              Guardar
            </button>
          </div>
        </div>
      </Dialog>

      {/* Confirmación antes de cancelar */}
      <Dialog
        open={showCancelConfirm}
        onClose={() => setShowCancelConfirm(false)}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-xl w-full max-w-sm relative z-10">
          <Dialog.Title className="text-lg font-bold text-center mb-4">
            ¿Cancelar reabastecimiento?
          </Dialog.Title>
          <p className="text-center text-sm mb-6">
            Los cambios no guardados se perderán.
          </p>
          <div className="flex justify-center gap-3">
            <button
              className="px-4 py-2 bg-zinc-700 text-white rounded-lg"
              onClick={() => setShowCancelConfirm(false)}
            >
              Volver
            </button>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded-lg"
              onClick={() => {
                setShowCancelConfirm(false);
                onClose();
              }}
            >
              Sí, salir
            </button>
          </div>
        </div>
      </Dialog>

      {/* Confirmación antes de guardar */}
      <Dialog
        open={showSaveConfirm}
        onClose={() => setShowSaveConfirm(false)}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-xl w-full max-w-sm relative z-10">
          <Dialog.Title className="text-lg font-bold text-center mb-4">
            ¿Guardar cambios?
          </Dialog.Title>
          <p className="text-center text-sm mb-6">
            Se actualizará el stock del producto{" "}
            <span className="font-semibold">{producto?.nombre}</span>.
          </p>
          <div className="flex justify-center gap-3">
            <button
              className="px-4 py-2 bg-zinc-700 text-white rounded-lg"
              onClick={() => setShowSaveConfirm(false)}
            >
              Cancelar
            </button>
            <button
              className="px-4 py-2 bg-yellow-500 text-black rounded-lg font-semibold"
              onClick={() => {
                handleSave();
                setShowSaveConfirm(false);
              }}
            >
              Sí, guardar
            </button>
          </div>
        </div>
      </Dialog>
    </>
  );
}
