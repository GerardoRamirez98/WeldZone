// src/admin/components/EditProductModal.tsx
import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { Camera } from "lucide-react";
import { categorias, etiquetas } from "../../data/options"; // ✅ importamos opciones

import type { Product } from "../../types/products";

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  producto: Product | null; // ✅ ahora coincide con tu Products.tsx
  onUpdate: (producto: Product) => void;
  onDelete: (id: number) => void;
}

export default function EditProductModal({
  isOpen,
  onClose,
  producto,
  onUpdate,
  onDelete,
}: EditProductModalProps) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [categoria, setCategoria] = useState("General");
  const [etiqueta, setEtiqueta] = useState<
    "Nuevo" | "Oferta" | "Descontinuado" | undefined
  >();
  const [imagen, setImagen] = useState<string>("");

  // Estados de confirmación
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (producto) {
      setNombre(producto.nombre);
      setDescripcion(producto.descripcion);
      setPrecio(producto.precio);
      setStock(producto.stock);
      setCategoria(producto.categoria);
      setEtiqueta(producto.etiqueta);
      setImagen(producto.imagenUrl || ""); // Aseguramos que sea string
    }
  }, [producto]);

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

  const handleUpdate = () => {
    if (!producto) return;
    const actualizado: Product = {
      ...producto,
      nombre,
      descripcion,
      precio,
      stock,
      categoria,
      etiqueta,
      imagenUrl: imagen,
    };
    onUpdate(actualizado);
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
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-xl w-full max-w-lg relative z-10">
          <Dialog.Title className="text-lg font-bold text-center mb-4 pb-2 border-b border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100">
            Editar producto
          </Dialog.Title>

          {/* Formulario */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Columna izquierda */}
            <div className="space-y-5">
              <div className="relative">
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="input-base peer"
                  placeholder=" "
                />
                <label className="label-base">Nombre</label>
              </div>
              <div className="relative">
                <textarea
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  className="input-base peer"
                  rows={2}
                  placeholder=" "
                />
                <label className="label-base">Descripción</label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <input
                    type="number"
                    value={precio}
                    onChange={(e) => setPrecio(Number(e.target.value))}
                    className="input-base peer"
                    placeholder=" "
                  />
                  <label className="label-base">Precio</label>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="input-base peer"
                    placeholder=" "
                  />
                  <label className="label-base">Stock</label>
                </div>
              </div>
              <div className="relative">
                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="select-base peer"
                >
                  {categorias.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <label className="label-base">Categoría</label>
              </div>
              <div className="relative">
                <select
                  value={etiqueta || ""}
                  onChange={(e) =>
                    setEtiqueta(
                      e.target.value as "Nuevo" | "Oferta" | undefined
                    )
                  }
                  className="select-base peer"
                >
                  <option value="">Sin etiqueta</option>
                  {etiquetas.map((tag) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
                <label className="label-base">Etiqueta</label>
              </div>
            </div>

            {/* Columna derecha */}
            <div className="flex flex-col items-center justify-center">
              <label className="text-sm mb-2 text-zinc-600 dark:text-zinc-400">
                Imagen
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full text-sm text-zinc-900 dark:text-zinc-100"
              />
              {imagen ? (
                <div className="mt-4">
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
          <div className="flex justify-between items-center gap-2 mt-6">
            <button
              className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition text-sm"
              onClick={() => setShowDeleteConfirm(true)}
            >
              Eliminar
            </button>
            <div className="flex gap-2 ml-auto">
              <button
                className="px-4 py-2 rounded-lg bg-zinc-700 text-white"
                onClick={() => setShowCancelConfirm(true)}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-yellow-500 text-black font-semibold"
                onClick={() => setShowSaveConfirm(true)}
              >
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      </Dialog>

      {/* Confirmación cancelar */}
      <Dialog
        open={showCancelConfirm}
        onClose={() => setShowCancelConfirm(false)}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-xl w-full max-w-sm relative z-10">
          <Dialog.Title className="text-lg font-bold text-center mb-4 text-zinc-900 dark:text-zinc-100">
            ¿Cancelar edición?
          </Dialog.Title>
          <p className="text-center text-sm mb-6 text-zinc-700 dark:text-zinc-300">
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

      {/* Confirmación guardar */}
      <Dialog
        open={showSaveConfirm}
        onClose={() => setShowSaveConfirm(false)}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-xl w-full max-w-sm relative z-10">
          <Dialog.Title className="text-lg font-bold text-center mb-4 text-zinc-900 dark:text-zinc-100">
            ¿Guardar cambios?
          </Dialog.Title>
          <p className="text-center text-sm mb-6 text-zinc-700 dark:text-zinc-300">
            Se sobrescribirá la información de este producto.
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
                handleUpdate();
                setShowSaveConfirm(false);
              }}
            >
              Sí, guardar
            </button>
          </div>
        </div>
      </Dialog>

      {/* Confirmación eliminar */}
      <Dialog
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-xl w-full max-w-sm relative z-10">
          <Dialog.Title className="text-lg font-bold text-center mb-4 text-red-600">
            ¿Eliminar producto?
          </Dialog.Title>
          <p className="text-center text-sm mb-6 text-zinc-700 dark:text-zinc-300">
            Estás a punto de eliminar{" "}
            <span className="font-semibold text-red-500">
              {producto?.nombre}
            </span>
            . Esta acción no se puede deshacer.
          </p>
          <div className="flex justify-center gap-3">
            <button
              className="px-4 py-2 bg-zinc-700 text-white rounded-lg"
              onClick={() => setShowDeleteConfirm(false)}
            >
              Cancelar
            </button>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold"
              onClick={() => {
                if (producto?.id !== undefined) {
                  onDelete(producto.id);
                }

                setShowDeleteConfirm(false);
                onClose();
              }}
            >
              Sí, eliminar
            </button>
          </div>
        </div>
      </Dialog>
    </>
  );
}
