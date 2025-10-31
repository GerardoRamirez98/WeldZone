import { Dialog } from "@headlessui/react";
import { useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (password: string) => void;
};

export default function ForceDeleteModal({
  isOpen,
  onClose,
  onConfirm,
}: Props) {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  const handleConfirm = () => {
    onConfirm(password);
    setPassword("");
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-xl w-full max-w-sm relative z-10 border border-zinc-200 dark:border-zinc-700">
        <Dialog.Title className="text-lg font-bold text-center mb-4 text-zinc-800 dark:text-zinc-100">
          Confirmar eliminación definitiva
        </Dialog.Title>
        <p className="text-center text-sm text-zinc-600 dark:text-zinc-300 mb-4">
          Esta acción eliminará el producto de forma permanente. Ingresa la
          contraseña de administrador para continuar.
        </p>
        <div className="space-y-2">
          <label className="text-sm text-zinc-600 dark:text-zinc-300">
            Contraseña
          </label>
          <div className="flex items-center gap-2">
            <input
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
              placeholder="Ingresa tu contraseña"
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="px-3 py-2 rounded-md text-sm bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200"
            >
              {show ? "Ocultar" : "Ver"}
            </button>
          </div>
        </div>
        <div className="flex justify-center gap-3 mt-6">
          <button
            className="px-4 py-2 rounded-lg bg-zinc-700 text-white hover:bg-zinc-600 transition text-sm"
            onClick={() => {
              setPassword("");
              onClose();
            }}
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition text-sm font-semibold disabled:opacity-50"
            disabled={!password}
            onClick={handleConfirm}
          >
            Eliminar definitivamente
          </button>
        </div>
      </div>
    </Dialog>
  );
}
