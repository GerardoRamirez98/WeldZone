import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { Camera } from "lucide-react";
import type { Product } from "../../types/products";
import { categorias, etiquetas } from "../../data/options";
import { supabase } from "../../lib/supabase";
import { createProduct } from "../../api/products.api";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (producto: Product) => void;
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
  const [imagenFile, setImagenFile] = useState<File | null>(null);
  const [imagenPreview, setImagenPreview] = useState<string | null>(null);

  const [showSaveConfirm, setShowSaveConfirm] = useState(false);

  // 🔄 Resetear formulario al abrir el modal
  const resetForm = () => {
    setNombre("");
    setDescripcion("");
    setPrecio(0);
    setStock(0);
    setCategoria("General");
    setEtiqueta(undefined);
    setImagenFile(null);
    setImagenPreview(null);
  };

  useEffect(() => {
    if (isOpen) resetForm();
  }, [isOpen]);

  // 📸 Vista previa de imagen
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagenFile(file);
      setImagenPreview(URL.createObjectURL(file));
    }
  };

  // 📤 Crear producto
  const handleSubmit = async () => {
    if (!nombre) {
      alert("⚠️ El nombre es obligatorio");
      return;
    }

    try {
      let imagenUrl: string | undefined;

      // 1️⃣ Subir imagen si existe
      if (imagenFile) {
        const fileName = `${Date.now()}-${imagenFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from("products")
          .upload(fileName, imagenFile);

        if (uploadError) {
          throw new Error(`Error al subir imagen: ${uploadError.message}`);
        }

        // ✅ Obtener URL pública
        const { data: publicUrlData } = supabase.storage
          .from("products")
          .getPublicUrl(fileName);

        imagenUrl = publicUrlData?.publicUrl;
      }

      // 2️⃣ Crear objeto producto
      const nuevoProducto: Product = {
        nombre,
        descripcion: descripcion || "Sin descripción",
        precio,
        stock,
        categoria,
        etiqueta,
        imagenUrl,
        estado: "Activo",
      };

      // 3️⃣ Enviar al backend
      const productoCreado = await createProduct(nuevoProducto);

      // 4️⃣ Actualizar UI
      onAdd(productoCreado);
      alert("✅ Producto creado correctamente");
      resetForm();
      setShowSaveConfirm(false);
      onClose();
    } catch {
      alert(
        "❌ Error al crear el producto. Revisa la configuración del backend o Supabase."
      );
    }
  };

  return (
    <>
      {/* 🧾 Modal de formulario */}
      <Dialog
        open={isOpen}
        onClose={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-xl w-full max-w-lg relative z-10 border border-zinc-200 dark:border-zinc-700">
          <Dialog.Title className="text-lg font-bold text-center mb-4 pb-2 border-b border-zinc-200 dark:border-zinc-700">
            Agregar producto
          </Dialog.Title>

          {/* 📋 Formulario */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 🧾 Columna izquierda */}
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
                  placeholder=" "
                  rows={2}
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

            {/* 📸 Columna derecha - Imagen */}
            <div className="flex flex-col items-center justify-center">
              <label className="text-sm mb-2 text-zinc-600 dark:text-zinc-400">
                Imagen
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full text-sm"
              />
              {imagenPreview ? (
                <img
                  src={imagenPreview}
                  alt="Preview"
                  className="mt-4 w-48 h-48 object-contain border rounded-lg shadow-md"
                />
              ) : (
                <div className="mt-4 w-48 h-48 flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 border rounded-lg text-zinc-400">
                  <Camera size={48} strokeWidth={1.5} />
                </div>
              )}
            </div>
          </div>

          {/* ✅ Botones */}
          <div className="flex justify-end gap-2 mt-6">
            <button
              className="px-4 py-2 rounded-lg bg-zinc-700 text-white hover:bg-zinc-600 transition text-sm"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              className="px-4 py-2 rounded-lg bg-yellow-500 text-black hover:bg-yellow-600 transition font-semibold text-sm"
              onClick={() => setShowSaveConfirm(true)}
            >
              Guardar
            </button>
          </div>
        </div>
      </Dialog>

      {/* 💾 Confirmación de Guardar */}
      <Dialog
        open={showSaveConfirm}
        onClose={() => setShowSaveConfirm(false)}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-xl w-full max-w-sm relative z-10">
          <Dialog.Title className="text-lg font-bold text-center mb-4">
            ¿Guardar producto?
          </Dialog.Title>
          <p className="text-center text-sm mb-6">
            Se agregará un nuevo producto a la lista.
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
              onClick={handleSubmit}
            >
              Sí, guardar
            </button>
          </div>
        </div>
      </Dialog>
    </>
  );
}
