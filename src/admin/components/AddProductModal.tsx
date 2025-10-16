import { useState, useEffect, useCallback } from "react";
import { Dialog } from "@headlessui/react";
import { Camera, Upload, Trash2, Eye, FilePlus2 } from "lucide-react";
import type { Product, NewProduct } from "../../types/products";
import { createProduct } from "../../api/products.api";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface Categoria {
  id: number;
  nombre: string;
}

interface Etiqueta {
  id: number;
  nombre: string;
  color: string;
}

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
  const [categoriaId, setCategoriaId] = useState<number | null>(null);
  const [etiquetaId, setEtiquetaId] = useState<number | null>(null);

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [etiquetas, setEtiquetas] = useState<Etiqueta[]>([]);

  const [imagenFile, setImagenFile] = useState<File | null>(null);
  const [imagenPreview, setImagenPreview] = useState<string | null>(null);

  // 🔹 Nuevo: mantenemos el archivo de especificaciones localmente
  const [specFile, setSpecFile] = useState<File | null>(null);

  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🧹 Reset form
  const resetForm = useCallback(() => {
    setNombre("");
    setDescripcion("");
    setPrecio(0);
    setCategoriaId(null);
    setEtiquetaId(null);
    setImagenFile(null);
    if (imagenPreview) URL.revokeObjectURL(imagenPreview);
    setImagenPreview(null);
    setSpecFile(null);
  }, [imagenPreview]);

  // 🚀 Cargar categorías y etiquetas
  useEffect(() => {
    if (!isOpen) return;
    const fetchData = async () => {
      try {
        const [cats, tags] = await Promise.all([
          fetch(`${API_URL}/config/categorias`).then((r) => r.json()),
          fetch(`${API_URL}/config/etiquetas`).then((r) => r.json()),
        ]);
        setCategorias(cats);
        setEtiquetas(tags);
      } catch {
        toast.error("❌ No se pudieron cargar categorías o etiquetas");
      }
    };
    fetchData();
  }, [isOpen]);

  // 🧼 Limpia el formulario al cerrar
  useEffect(() => {
    if (!isOpen) resetForm();
  }, [isOpen, resetForm]);

  // 📸 Seleccionar imagen (sin subir aún)
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (imagenPreview) URL.revokeObjectURL(imagenPreview);
      setImagenFile(file);
      setImagenPreview(URL.createObjectURL(file));
      toast.success("📸 Imagen seleccionada correctamente");
    }
  };

  // 📄 Seleccionar archivo (sin subir aún)
  const handleSpecSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSpecFile(file);
    toast.success(`📄 Archivo seleccionado: ${file.name}`);
  };

  // 💾 Guardar producto
  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    if (!nombre.trim()) {
      toast.warning("⚠️ El nombre es obligatorio");
      setIsSubmitting(false);
      return;
    }
    if (precio <= 0) {
      toast.warning("⚠️ El precio debe ser mayor a 0");
      setIsSubmitting(false);
      return;
    }

    const toastId = toast.loading("Guardando producto...");

    try {
      let imagenUrl: string | undefined;
      let specFileUrl: string | undefined;

      // 🔹 Subir imagen al guardar
      if (imagenFile) {
        const formData = new FormData();
        formData.append("file", imagenFile);
        const res = await fetch(`${API_URL}/upload`, {
          method: "POST",
          body: formData,
        });
        if (!res.ok) throw new Error("Error al subir la imagen");
        const data = await res.json();
        imagenUrl = data.url;
      }

      // 🔹 Subir archivo de especificaciones al guardar
      if (specFile) {
        const formData = new FormData();
        formData.append("file", specFile);
        const res = await fetch(`${API_URL}/upload-specs`, {
          method: "POST",
          body: formData,
        });
        if (!res.ok)
          throw new Error("Error al subir archivo de especificaciones");
        const data = await res.json();
        specFileUrl = data.url;
      }

      // 🧩 Crear producto final
      const nuevoProducto: Partial<Product> = {
        nombre,
        descripcion,
        precio,
        categoriaId: categoriaId || undefined,
        etiquetaId: etiquetaId || undefined,
        imagenUrl,
        specFileUrl,
        estado: "activo",
      };

      const productoCreado = await createProduct(nuevoProducto as NewProduct);
      onAdd(productoCreado);
      toast.success("✅ Producto creado correctamente", { id: toastId });

      resetForm();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("❌ Error al crear producto", { id: toastId });
    } finally {
      setIsSubmitting(false);
      setShowSaveConfirm(false);
    }
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={() => {
          resetForm();
          onClose();
        }}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-xl w-full max-w-lg relative z-10 border border-zinc-200 dark:border-zinc-700">
          <Dialog.Title className="text-lg font-bold text-center mb-4 pb-2 border-b border-zinc-200 dark:border-zinc-700">
            Agregar producto
          </Dialog.Title>

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
                  placeholder=" "
                  rows={2}
                />
                <label className="label-base">Descripción</label>
              </div>

              {/* Precio */}
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  value={precio === 0 ? "" : precio}
                  onChange={(e) => setPrecio(parseFloat(e.target.value) || 0)}
                  className="input-base peer"
                  placeholder=" "
                />
                <label className="label-base">Precio</label>
              </div>

              {/* Categoría */}
              <div className="relative">
                <select
                  value={categoriaId ?? ""}
                  onChange={(e) =>
                    setCategoriaId(
                      e.target.value ? Number(e.target.value) : null
                    )
                  }
                  className="select-base peer"
                >
                  <option value="">Sin categoría</option>
                  {categorias.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nombre}
                    </option>
                  ))}
                </select>
                <label className="label-base">Categoría</label>
              </div>

              {/* Etiqueta */}
              <div className="relative">
                <select
                  value={etiquetaId ?? ""}
                  onChange={(e) =>
                    setEtiquetaId(
                      e.target.value ? Number(e.target.value) : null
                    )
                  }
                  className="select-base peer"
                >
                  <option value="">Sin etiqueta</option>
                  {etiquetas.map((tag) => (
                    <option key={tag.id} value={tag.id}>
                      {tag.nombre}
                    </option>
                  ))}
                </select>
                <label className="label-base">Etiqueta</label>
              </div>
            </div>

            {/* Columna derecha */}
            <div className="flex flex-col gap-6">
              {/* Archivo de especificaciones */}
              <div className="flex flex-col items-center w-full mt-2">
                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-200 mb-2 flex items-center gap-1">
                  <FilePlus2 className="w-4 h-4 text-yellow-500" />
                  Archivo de especificaciones
                </label>

                {specFile ? (
                  <div className="flex flex-col items-center gap-2 text-sm">
                    <div className="flex gap-3 items-center justify-center">
                      <button
                        onClick={() =>
                          window.open(URL.createObjectURL(specFile), "_blank")
                        }
                        className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium transition text-xs cursor-pointer shadow-sm"
                      >
                        <Eye size={14} strokeWidth={1.8} /> Ver
                      </button>
                      <button
                        onClick={() => setSpecFile(null)}
                        className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-md bg-red-600 hover:bg-red-700 text-white font-medium transition text-xs cursor-pointer shadow-sm"
                      >
                        <Trash2 size={14} strokeWidth={1.8} /> Quitar
                      </button>
                    </div>
                    <p className="text-xs text-zinc-500 truncate max-w-[230px] text-center mt-1">
                      {specFile.name}
                    </p>
                  </div>
                ) : (
                  <label className="flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-yellow-500 hover:bg-yellow-600 text-black text-xs font-semibold cursor-pointer transition shadow-sm">
                    <Upload size={14} strokeWidth={1.8} /> Seleccionar archivo
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleSpecSelect}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Imagen */}
              <div className="flex flex-col items-center justify-center">
                <label className="text-sm mb-2 text-zinc-600 dark:text-zinc-400 font-semibold">
                  Imagen del producto
                </label>

                <div className="flex flex-wrap justify-center gap-2 mb-3">
                  <label className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-zinc-700 text-white text-xs font-medium hover:bg-zinc-600 cursor-pointer transition">
                    📁 Seleccionar
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageSelect}
                    />
                  </label>
                </div>

                {imagenPreview ? (
                  <img
                    src={imagenPreview}
                    alt="Preview"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        "/placeholder-image.png";
                    }}
                    className="mt-2 w-48 h-48 object-contain border-2 border-yellow-500 rounded-xl shadow-lg"
                  />
                ) : (
                  <div className="mt-2 w-48 h-48 flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 border-2 border-dashed border-zinc-400 rounded-xl text-zinc-400">
                    <Camera size={48} strokeWidth={1.5} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-2 mt-6">
            <button
              className="px-4 py-2 rounded-lg bg-zinc-700 text-white hover:bg-zinc-600 transition text-sm"
              onClick={() => {
                resetForm();
                onClose();
              }}
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

      {/* Confirmación */}
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
              className="px-4 py-2 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 transition"
              onClick={() => setShowSaveConfirm(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </button>

            <button
              disabled={isSubmitting}
              className={`px-4 py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2
          ${
            isSubmitting
              ? "bg-yellow-400 text-black opacity-70 cursor-not-allowed"
              : "bg-yellow-500 hover:bg-yellow-600 text-black"
          }`}
              onClick={handleSubmit}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-black"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l3 3-3 3v-4a8 8 0 01-8-8z"
                    ></path>
                  </svg>
                  <span>Guardando...</span>
                </>
              ) : (
                "Sí, guardar"
              )}
            </button>
          </div>
        </div>
      </Dialog>
    </>
  );
}
