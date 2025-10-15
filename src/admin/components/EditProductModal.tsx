// src/admin/components/EditProductModal.tsx
import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { Camera, Upload, Trash2, Eye, FilePlus2 } from "lucide-react";
import type { Product } from "../../types/products";
import { updateProduct } from "../../api/products.api";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// 🧩 Helper para subir archivo de especificaciones
async function uploadSpecFile(
  file: File,
  oldUrl?: string | null
): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  if (oldUrl) {
    const oldPath = extractPathFromPublicUrl(oldUrl, "products-specs");
    if (oldPath) formData.append("oldPath", oldPath);
  }
  const res = await fetch(`${API_URL}/upload-specs`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  return data.url;
}

function extractPathFromPublicUrl(url: string, bucket: string) {
  try {
    const u = new URL(url);
    const marker = `/storage/v1/object/public/${bucket}/`;
    const idx = u.pathname.indexOf(marker);
    if (idx === -1) return null;
    return decodeURIComponent(u.pathname.substring(idx + marker.length));
  } catch {
    return null;
  }
}

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

  // 🔹 Relacionales
  const [categoriaId, setCategoriaId] = useState<number | null>(null);
  const [etiquetaId, setEtiquetaId] = useState<number | null>(null);

  const [imagenFile, setImagenFile] = useState<File | null>(null);
  const [imagenPreview, setImagenPreview] = useState("");
  const [specFileUrl, setSpecFileUrl] = useState<string | null>(null);

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

      // ⚙️ Cargar relaciones (maneja objeto o ID directo)
      setCategoriaId(producto.categoriaId ?? producto.categoria?.id ?? null);
      setEtiquetaId(producto.etiquetaId ?? producto.etiqueta?.id ?? null);

      setImagenPreview(producto.imagenUrl || "");
      setSpecFileUrl(producto.specFileUrl || null);
      setImagenFile(null);
    }
  }, [producto]);

  // 📸 Manejar carga de imagen
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagenFile(file);
      setImagenPreview(URL.createObjectURL(file));
      toast.success("📸 Imagen cargada correctamente");
    }
  };

  // 📄 Manejar carga del archivo de especificaciones
  const handleSpecUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      toast.message("📤 Subiendo archivo de especificaciones...");
      const url = await uploadSpecFile(file, specFileUrl);
      setSpecFileUrl(url);
      toast.success(`✅ ${file.name} subido correctamente`);
    } catch (err) {
      console.error(err);
      toast.error("❌ Error al subir el archivo de especificaciones");
    }
  };

  // 💾 Guardar cambios
  const handleUpdate = async () => {
    try {
      let imagenUrl = producto.imagenUrl;

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
        categoriaId: categoriaId ?? undefined,
        etiquetaId: etiquetaId ?? undefined,
        imagenUrl,
        specFileUrl,
      };

      if (!nombre) {
        toast.warning("⚠️ El nombre es obligatorio");
        return;
      }
      if (precio <= 0) {
        toast.warning("⚠️ El precio debe ser mayor a 0");
        return;
      }

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

              {/* Precio */}
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
              </div>

              {/* Categoría */}
              <div className="relative">
                <input
                  type="number"
                  value={categoriaId ?? ""}
                  onChange={(e) => setCategoriaId(Number(e.target.value))}
                  className="input-base peer"
                  placeholder=" "
                />
                <label className="label-base">ID de categoría</label>
              </div>

              {/* Etiqueta */}
              <div className="relative">
                <input
                  type="number"
                  value={etiquetaId ?? ""}
                  onChange={(e) => setEtiquetaId(Number(e.target.value))}
                  className="input-base peer"
                  placeholder=" "
                />
                <label className="label-base">ID de etiqueta</label>
              </div>
            </div>

            {/* 📸 Columna derecha */}
            <div className="flex flex-col items-center justify-start gap-6">
              {/* Imagen del producto */}
              <div className="flex flex-col items-center w-full">
                <label className="text-sm mb-2 text-zinc-700 dark:text-zinc-300 font-semibold">
                  Imagen del producto
                </label>

                {/* Botones */}
                <div className="flex justify-center items-center gap-3 mb-4">
                  <label className="flex items-center justify-center w-9 h-9 rounded-full bg-yellow-500 text-white hover:bg-yellow-600 cursor-pointer transition">
                    <Camera size={18} strokeWidth={1.8} />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>

                  <label
                    onClick={() => {
                      if (!imagenPreview) return;
                      setImagenFile(null);
                      setImagenPreview("");
                      toast.info("🗑️ Imagen quitada del producto");
                    }}
                    className={`flex items-center justify-center w-9 h-9 rounded-full shadow-sm active:scale-[0.95] transition cursor-pointer ${
                      imagenPreview
                        ? "bg-red-600 text-white hover:bg-red-700"
                        : "bg-zinc-400 text-zinc-300 cursor-not-allowed opacity-70"
                    }`}
                  >
                    <Trash2 size={18} strokeWidth={1.8} />
                  </label>
                </div>

                {/* Vista previa */}
                {imagenPreview ? (
                  <img
                    src={imagenPreview}
                    alt="Preview"
                    className="w-44 h-44 object-contain border-2 border-yellow-500 rounded-xl shadow-lg"
                  />
                ) : (
                  <div className="w-44 h-44 flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 border-2 border-dashed border-zinc-400 rounded-xl text-zinc-400">
                    <Camera size={44} strokeWidth={1.5} />
                  </div>
                )}
              </div>

              {/* Archivo de especificaciones */}
              <div className="flex flex-col items-center w-full">
                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-200 mb-2 flex items-center gap-1">
                  <FilePlus2 className="w-4 h-4 text-yellow-500" />
                  Archivo de especificaciones
                </label>

                {specFileUrl ? (
                  <div className="flex flex-col items-center gap-2 text-sm">
                    <div className="flex gap-3 items-center justify-center">
                      <label
                        onClick={() => window.open(specFileUrl, "_blank")}
                        className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium transition text-xs cursor-pointer shadow-sm"
                      >
                        <Eye size={14} strokeWidth={1.8} />
                        Ver
                      </label>
                      <label
                        onClick={() => {
                          setSpecFileUrl(null);
                          toast.info("🗑️ Archivo eliminado");
                        }}
                        className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-md bg-red-600 hover:bg-red-700 text-white font-medium transition text-xs cursor-pointer shadow-sm"
                      >
                        <Trash2 size={14} strokeWidth={1.8} />
                        Quitar
                      </label>
                    </div>
                    <p className="text-xs text-zinc-500 truncate max-w-[230px] text-center mt-1">
                      {decodeURIComponent(specFileUrl.split("/").pop() || "")}
                    </p>
                  </div>
                ) : (
                  <label className="flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-yellow-500 hover:bg-yellow-600 text-black text-xs font-semibold cursor-pointer transition shadow-sm">
                    <Upload size={14} strokeWidth={1.8} />
                    Subir archivo
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleSpecUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
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
                className="px-4 py-2 rounded-lg bg-zinc-200 text-zinc-800 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600 transition"
                onClick={() => setShowCancelConfirm(true)}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-yellow-500 text-black font-semibold hover:bg-yellow-600 transition"
                onClick={() => setShowSaveConfirm(true)}
              >
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      </Dialog>

      {/* Confirmaciones (corregidas para texto visible en ambos modos) */}
      <Dialog
        open={showCancelConfirm}
        onClose={() => setShowCancelConfirm(false)}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        <div className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white p-6 rounded-xl shadow-xl w-full max-w-sm relative z-10">
          <Dialog.Title className="text-lg font-bold text-center mb-4">
            ¿Cancelar edición?
          </Dialog.Title>
          <p className="text-center text-sm mb-6">
            Los cambios no guardados se perderán.
          </p>
          <div className="flex justify-center gap-3">
            <button
              className="px-4 py-2 bg-zinc-200 text-zinc-800 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600 rounded-lg transition"
              onClick={() => setShowCancelConfirm(false)}
            >
              Volver
            </button>
            <button
              className="px-4 py-2 bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 rounded-lg font-semibold transition"
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
        <div className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white p-6 rounded-xl shadow-xl w-full max-w-sm relative z-10">
          <Dialog.Title className="text-lg font-bold text-center mb-4">
            ¿Guardar cambios?
          </Dialog.Title>
          <p className="text-center text-sm mb-6">
            Se sobrescribirá la información del producto.
          </p>
          <div className="flex justify-center gap-3">
            <button
              className="px-4 py-2 bg-zinc-200 text-zinc-800 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600 rounded-lg transition"
              onClick={() => setShowSaveConfirm(false)}
            >
              Cancelar
            </button>
            <button
              className="px-4 py-2 bg-yellow-500 text-black hover:bg-yellow-600 dark:bg-yellow-500 dark:hover:bg-yellow-600 rounded-lg font-semibold transition"
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
        <div className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white p-6 rounded-xl shadow-xl w-full max-w-sm relative z-10">
          <Dialog.Title className="text-lg font-bold text-center mb-4 text-red-600 dark:text-red-400">
            ¿Eliminar producto?
          </Dialog.Title>
          <p className="text-center text-sm mb-6">
            Estás a punto de eliminar{" "}
            <span className="font-semibold text-red-500 dark:text-red-400">
              {producto?.nombre}
            </span>
            . Esta acción no se puede deshacer.
          </p>
          <div className="flex justify-center gap-3">
            <button
              className="px-4 py-2 bg-zinc-200 text-zinc-800 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600 rounded-lg transition"
              onClick={() => setShowDeleteConfirm(false)}
            >
              Cancelar
            </button>
            <button
              className="px-4 py-2 bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 rounded-lg font-semibold transition"
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
