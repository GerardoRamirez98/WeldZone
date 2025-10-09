// src/admin/components/EditProductModal.tsx
import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { Camera, Upload, Trash2 } from "lucide-react";
import { categorias, etiquetas } from "../../data/options";
import type { Product } from "../../types/products";
import { updateProduct } from "../../api/products.api";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  producto: Product;
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
  const [precio, setPrecio] = useState(0);
  const [precioInput, setPrecioInput] = useState("0.00");
  const [stock, setStock] = useState(0);
  const [stockInput, setStockInput] = useState("0");
  const [categoria, setCategoria] = useState("General");
  const [etiqueta, setEtiqueta] = useState<
    "Nuevo" | "Oferta" | "Descontinuado" | undefined
  >();
  const [imagenFile, setImagenFile] = useState<File | null>(null);
  const [imagenPreview, setImagenPreview] = useState("");

  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // ✅ Cargar producto actual
  useEffect(() => {
    if (producto) {
      setNombre(producto.nombre);
      setDescripcion(producto.descripcion || "");
      setPrecio(producto.precio);
      setPrecioInput(producto.precio.toFixed(2));
      setStock(producto.stock);
      setStockInput(producto.stock.toString());
      setCategoria(producto.categoria || "General");
      setEtiqueta(producto.etiqueta);
      setImagenPreview(producto.imagenUrl || "");
      setImagenFile(null);
    }
  }, [producto]);

  // 📸 Manejar carga de imagen
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagenFile(file);
      setImagenPreview(URL.createObjectURL(file));
    }
  };

  // 💾 Guardar cambios
  const handleUpdate = async () => {
    try {
      let imagenUrl = producto.imagenUrl;

      // 🖼️ Subir nueva imagen si hay
      if (imagenFile) {
        const formData = new FormData();
        formData.append("file", imagenFile);

        const res = await fetch(`${API_URL}/upload`, {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error("Error al subir la nueva imagen");
        const data = await res.json();
        imagenUrl = data.url;
      }

      const actualizado: Partial<Product> = {
        nombre,
        descripcion,
        precio,
        stock,
        categoria,
        etiqueta,
        imagenUrl,
      };

      const actualizadoDB = await updateProduct(producto.id, actualizado);
      onUpdate(actualizadoDB);
      setShowSaveConfirm(false);
      onClose();
      toast.success("✅ Producto actualizado correctamente");
    } catch (err) {
      console.error("❌ Error al actualizar el producto:", err);
      toast.error("❌ No se pudo actualizar el producto o subir la imagen.");
    }
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

          {/* 📋 Formulario */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Columna izquierda */}
            <div className="space-y-5">
              {/* Nombre */}
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

              {/* Descripción */}
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

              {/* Precio y Stock */}
              <div className="grid grid-cols-2 gap-4 mt-4">
                {/* Precio */}
                <div className="relative">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={precioInput}
                    onChange={(e) => {
                      const value = e.target.value.replace(",", ".");
                      if (/^[0-9]*[.,]?[0-9]*$/.test(value)) {
                        setPrecioInput(value);
                      }
                    }}
                    onBlur={() => {
                      const num = parseFloat(precioInput);
                      if (isNaN(num)) {
                        setPrecio(0);
                        setPrecioInput("0.00");
                        return;
                      }
                      const positive = Math.abs(num);
                      setPrecio(positive);
                      setPrecioInput(
                        positive.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                      );
                    }}
                    onFocus={() => setPrecioInput(precio.toString())}
                    onKeyDown={(e) => {
                      if (["e", "E", "+", "-"].includes(e.key))
                        e.preventDefault();
                    }}
                    className="input-base peer"
                    placeholder=" "
                  />
                  <label className="label-base">Precio</label>
                </div>

                {/* Stock */}
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={stockInput}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      if (/^\d*$/.test(value)) {
                        setStockInput(value);
                      }
                    }}
                    onBlur={() => {
                      const num = parseInt(stockInput, 10);
                      if (isNaN(num)) {
                        setStock(0);
                        setStockInput("0");
                        return;
                      }
                      const positive = Math.abs(num);
                      setStock(positive);
                      setStockInput(positive.toLocaleString("en-US"));
                    }}
                    onFocus={() => setStockInput(stock.toString())}
                    onKeyDown={(e) => {
                      if (["e", "E", "+", "-", "."].includes(e.key))
                        e.preventDefault();
                    }}
                    className="input-base peer"
                    placeholder=" "
                  />
                  <label className="label-base">Stock</label>
                </div>
              </div>

              {/* Categoría */}
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

              {/* Etiqueta */}
              <div className="relative">
                <select
                  value={etiqueta || ""}
                  onChange={(e) =>
                    setEtiqueta(
                      e.target.value as
                        | "Nuevo"
                        | "Oferta"
                        | "Descontinuado"
                        | undefined
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
              <label className="text-sm mb-2 text-zinc-600 dark:text-zinc-400 font-semibold">
                Imagen del producto
              </label>

              {/* 🔘 Botones de acción minimalistas */}
              <div className="flex justify-center items-center gap-3 mb-4">
                {/* 📸 Tomar foto */}
                <label className="flex items-center justify-center min-w-[40px] h-[40px] rounded-full bg-yellow-500 text-white shadow-sm hover:bg-yellow-600 active:scale-[0.95] cursor-pointer transition">
                  <Camera size={18} strokeWidth={1.8} />
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>

                {/* 📁 Subir archivo */}
                <label className="flex items-center justify-center min-w-[40px] h-[40px] rounded-full bg-zinc-700 text-white shadow-sm hover:bg-zinc-600 active:scale-[0.95] cursor-pointer transition">
                  <Upload size={18} strokeWidth={1.8} />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>

                {/* 🗑️ Quitar imagen */}
                <label
                  onClick={() => {
                    if (!imagenPreview) return;
                    setImagenFile(null);
                    setImagenPreview("");
                    toast.info("🗑️ Imagen quitada del producto");
                  }}
                  className={`flex items-center justify-center min-w-[40px] h-[40px] rounded-full shadow-sm active:scale-[0.95] transition ${
                    imagenPreview
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-zinc-400 text-zinc-300 cursor-not-allowed opacity-70"
                  }`}
                >
                  <Trash2 size={18} strokeWidth={1.8} />
                </label>
              </div>

              {/* 🖼️ Vista previa */}
              {imagenPreview ? (
                <img
                  src={imagenPreview}
                  alt="Preview"
                  className="mt-2 w-48 h-48 object-contain border-2 border-yellow-500 rounded-xl shadow-lg transition-all duration-300"
                />
              ) : (
                <div className="mt-2 w-48 h-48 flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 border-2 border-dashed border-zinc-400 rounded-xl text-zinc-400 transition-all duration-300">
                  <Camera size={48} strokeWidth={1.5} />
                </div>
              )}
            </div>
          </div>

          {/* Botones inferiores */}
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

      {/* Confirmaciones */}
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
              onClick={handleUpdate}
            >
              Sí, guardar
            </button>
          </div>
        </div>
      </Dialog>

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
                onDelete(producto.id);
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
