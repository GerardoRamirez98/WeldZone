// src/admin/components/AddProductModal.tsx
import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import type { Producto } from "../../data/products";
import { Camera } from "lucide-react";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (producto: Producto) => void;
}

export default function AddProductModal({
  isOpen,
  onClose,
  onAdd,
}: AddProductModalProps) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [categoria, setCategoria] = useState("General");
  const [etiqueta, setEtiqueta] = useState<"Nuevo" | "Oferta" | undefined>();
  const [imagen, setImagen] = useState<string>("");

  // Estado para el modal de confirmación
  const [showConfirm, setShowConfirm] = useState(false);

  const resetForm = () => {
    setNombre("");
    setDescripcion("");
    setPrecio(0);
    setStock(0);
    setCategoria("General");
    setEtiqueta(undefined);
    setImagen("");
  };

  // Reset automático cada vez que se abre el modal
  useEffect(() => {
    if (isOpen) resetForm();
  }, [isOpen]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setImagen(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!nombre) return alert("El nombre es obligatorio");

    const nuevoProducto: Producto = {
      id: Date.now(),
      nombre,
      descripcion: descripcion || "Sin descripción",
      precio,
      stock,
      estado: "Activo",
      imagen,
      categoria,
      etiqueta,
    };

    onAdd(nuevoProducto);
    resetForm();
    onClose();
  };

  const handleCancelClick = () => {
    setShowConfirm(true); // muestra modal de confirmación
  };

  const confirmCancel = () => {
    resetForm();
    setShowConfirm(false);
    onClose();
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={handleCancelClick}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        {/* Fondo */}
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          aria-hidden="true"
        />

        {/* Contenedor */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-xl w-full max-w-lg relative z-10 border border-zinc-200 dark:border-zinc-700">
          {/* Título */}
          <Dialog.Title className="text-lg font-bold text-center mb-4 pb-2 border-b border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-100">
            Agregar producto
          </Dialog.Title>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Columna izquierda */}
            <div className="space-y-5">
              {/* Nombre */}
              <div className="relative">
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="peer w-full p-2 pt-5 border-b-2 border-zinc-300 dark:border-zinc-600 bg-transparent text-zinc-800 dark:text-zinc-200 focus:border-yellow-500 focus:outline-none"
                  placeholder=" "
                />
                <label className="absolute left-2 top-1 text-sm text-zinc-500 dark:text-zinc-400 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-zinc-400 transition-all">
                  Nombre
                </label>
              </div>

              {/* Descripción */}
              <div className="relative">
                <textarea
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  className="peer w-full p-2 pt-5 border-b-2 border-zinc-300 dark:border-zinc-600 bg-transparent text-zinc-800 dark:text-zinc-200 focus:border-yellow-500 focus:outline-none"
                  placeholder=" "
                  rows={2}
                />
                <label className="absolute left-2 top-1 text-sm text-zinc-500 dark:text-zinc-400 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-zinc-400 transition-all">
                  Descripción
                </label>
              </div>

              {/* Precio & Stock */}
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <input
                    type="number"
                    value={precio}
                    onChange={(e) => setPrecio(Number(e.target.value))}
                    className="peer w-full p-2 pt-5 border-b-2 border-zinc-300 dark:border-zinc-600 bg-transparent text-zinc-800 dark:text-zinc-200 focus:border-yellow-500 focus:outline-none"
                    placeholder=" "
                  />
                  <label className="absolute left-2 top-1 text-sm text-zinc-500 dark:text-zinc-400 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-zinc-400 transition-all">
                    Precio
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="peer w-full p-2 pt-5 border-b-2 border-zinc-300 dark:border-zinc-600 bg-transparent text-zinc-800 dark:text-zinc-200 focus:border-yellow-500 focus:outline-none"
                    placeholder=" "
                  />
                  <label className="absolute left-2 top-1 text-sm text-zinc-500 dark:text-zinc-400 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-zinc-400 transition-all">
                    Stock
                  </label>
                </div>
              </div>

              {/* Categoría */}
              <div className="relative">
                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="peer w-full p-2 pt-5 border-b-2 border-zinc-300 dark:border-zinc-600 
               bg-white dark:bg-zinc-800 
               text-zinc-800 dark:text-zinc-200 
               focus:border-yellow-500 focus:outline-none"
                >
                  <option value="General">General</option>
                  <option value="Soldadoras">Soldadoras</option>
                  <option value="Careta">Caretas</option>
                  <option value="Guantes">Guantes</option>
                  <option value="Consumibles">Consumibles</option>
                </select>

                <label className="absolute left-2 top-1 text-sm text-zinc-500 dark:text-zinc-400 peer-focus:top-1 peer-focus:text-sm">
                  Categoría
                </label>
              </div>

              {/* Etiqueta */}
              <div className="relative">
                <select
                  value={etiqueta || ""}
                  onChange={(e) =>
                    setEtiqueta(
                      e.target.value as "Nuevo" | "Oferta" | undefined
                    )
                  }
                  className="peer w-full p-2 pt-5 border-b-2 
               border-zinc-300 dark:border-zinc-600 
               bg-white dark:bg-zinc-800 
               text-zinc-800 dark:text-zinc-200 
               focus:border-yellow-500 focus:outline-none"
                >
                  <option value="">Sin etiqueta</option>
                  <option value="Nuevo">Nuevo</option>
                  <option value="Oferta">Oferta</option>
                </select>

                <label className="absolute left-2 top-1 text-sm text-zinc-500 dark:text-zinc-400 peer-focus:top-1 peer-focus:text-sm">
                  Etiqueta
                </label>
              </div>
            </div>

            {/* Columna derecha (imagen) */}
            <div className="flex flex-col items-center justify-center">
              <label className="text-sm text-zinc-800 dark:text-zinc-200 mb-2">
                Imagen
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full text-sm text-zinc-600 dark:text-zinc-300"
              />

              {/* Preview o placeholder */}
              {imagen ? (
                <div className="mt-4 flex items-center justify-center">
                  <img
                    src={imagen}
                    alt="Preview"
                    className="w-48 h-48 object-contain border rounded-lg shadow-md"
                  />
                </div>
              ) : (
                <div className="mt-4 w-48 h-48 flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 border rounded-lg text-zinc-400">
                  <Camera size={48} strokeWidth={1.5} />
                </div>
              )}
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-2 mt-6">
            <button
              className="px-4 py-2 rounded-lg bg-zinc-700 text-white hover:bg-zinc-600 transition text-sm"
              onClick={handleCancelClick}
            >
              Cancelar
            </button>
            <button
              className="px-4 py-2 rounded-lg bg-yellow-500 text-black hover:bg-yellow-600 transition font-semibold text-sm"
              onClick={handleSubmit}
            >
              Guardar
            </button>
          </div>
        </div>
      </Dialog>

      {/* 🔔 Modal de confirmación */}
      <Dialog
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-xl w-full max-w-sm relative z-10 border border-zinc-200 dark:border-zinc-700">
          <Dialog.Title className="text-lg font-bold text-center mb-4 text-zinc-800 dark:text-zinc-100">
            ¿Estás seguro?
          </Dialog.Title>
          <p className="text-center text-sm text-zinc-600 dark:text-zinc-300 mb-6">
            La información agregada se perderá.
          </p>
          <div className="flex justify-center gap-3">
            <button
              className="px-4 py-2 rounded-lg bg-zinc-700 text-white hover:bg-zinc-600 transition text-sm"
              onClick={() => setShowConfirm(false)}
            >
              No, volver
            </button>
            <button
              className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition text-sm font-semibold"
              onClick={confirmCancel}
            >
              Sí, salir
            </button>
          </div>
        </div>
      </Dialog>
    </>
  );
}
