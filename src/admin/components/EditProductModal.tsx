import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { Camera, Upload, Trash2, Eye, FilePlus2 } from "lucide-react";
import type { Product } from "../../types/products";
import { updateProduct } from "../../api/products.api";
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
  const [categoriaId, setCategoriaId] = useState<number | null>(null);
  const [etiquetaId, setEtiquetaId] = useState<number | null>(null);

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [etiquetas, setEtiquetas] = useState<Etiqueta[]>([]);

  // 🔹 Archivos locales
  const [imagenFile, setImagenFile] = useState<File | null>(null);
  const [imagenPreview, setImagenPreview] = useState<string | null>(null);
  const [specFile, setSpecFile] = useState<File | null>(null);
  const [specFileUrl, setSpecFileUrl] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // ✅ Cargar datos iniciales
  useEffect(() => {
    if (producto) {
      setNombre(producto.nombre);
      setDescripcion(producto.descripcion || "");
      setPrecio(producto.precio);
      setCategoriaId(producto.categoriaId ?? producto.categoria?.id ?? null);
      setEtiquetaId(producto.etiquetaId ?? producto.etiqueta?.id ?? null);
      setImagenPreview(producto.imagenUrl || null);
      setSpecFileUrl(producto.specFileUrl || null);
      setImagenFile(null);
      setSpecFile(null);
    }
  }, [producto]);

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

  // 📸 Seleccionar imagen localmente
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (imagenPreview) URL.revokeObjectURL(imagenPreview);
      setImagenFile(file);
      setImagenPreview(URL.createObjectURL(file));
      toast.success("📸 Imagen seleccionada correctamente");
    }
  };

  // 📄 Seleccionar archivo localmente
  const handleSpecSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSpecFile(file);
    toast.success(`📄 Archivo seleccionado: ${file.name}`);
  };

  // 💾 Guardar cambios con rollback visual
  const handleUpdate = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    // 🧩 Guardamos referencias originales para rollback
    const oldPreview = imagenPreview;
    const oldSpecUrl = specFileUrl;

    try {
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

      const toastId = toast.loading("Actualizando producto...");

      let imagenUrl = producto.imagenUrl;
      let specUrl = producto.specFileUrl;

      // 🔹 Subir imagen si se cambió
      if (imagenFile) {
        try {
          const formData = new FormData();
          formData.append("file", imagenFile);
          const res = await fetch(`${API_URL}/upload`, {
            method: "POST",
            body: formData,
          });
          if (!res.ok) throw new Error("Error al subir imagen");
          const data = await res.json();
          imagenUrl = data.url;
        } catch (err) {
          console.error("❌ Falla en subida de imagen:", err);
          setImagenPreview(oldPreview); // 🔄 rollback visual
          setImagenFile(null);
          toast.error("❌ Error al subir la imagen, se mantiene la anterior");
        }
      }

      // 🔹 Subir archivo PDF/DOCX si se cambió
      if (specFile) {
        try {
          const formData = new FormData();
          formData.append("file", specFile);
          const res = await fetch(`${API_URL}/upload-specs`, {
            method: "POST",
            body: formData,
          });
          if (!res.ok)
            throw new Error("Error al subir archivo de especificaciones");
          const data = await res.json();
          specUrl = data.url;
        } catch (err) {
          console.error("❌ Falla en subida de archivo:", err);
          setSpecFileUrl(oldSpecUrl); // 🔄 rollback visual
          setSpecFile(null);
          toast.error("❌ Error al subir el archivo, se mantiene el anterior");
        }
      }

      const actualizado: Partial<Product> = {
        nombre,
        descripcion,
        precio,
        categoriaId: categoriaId || undefined,
        etiquetaId: etiquetaId || undefined,
        imagenUrl,
        specFileUrl: specUrl,
      };

      const actualizadoDB = await updateProduct(producto.id, actualizado);
      onUpdate(actualizadoDB);

      toast.success("✅ Producto actualizado correctamente", { id: toastId });
      setShowSaveConfirm(false);
      onClose();
    } catch (err) {
      console.error("❌ Error al actualizar producto:", err);
      toast.error(
        "❌ Error al guardar los cambios. No se modificó el producto."
      );
      // 🧩 Rollback total visual
      setImagenPreview(oldPreview);
      setSpecFileUrl(oldSpecUrl);
    } finally {
      setIsSubmitting(false);
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

              <div className="relative">
                <input
                  type="number"
                  min="0"
                  value={precio}
                  onChange={(e) => setPrecio(parseFloat(e.target.value))}
                  className="input-base peer"
                  placeholder=" "
                />
                <label className="label-base">Precio</label>
              </div>

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
            <div className="flex flex-col gap-6 items-center">
              {/* Imagen */}
              <div className="flex flex-col items-center w-full">
                <label className="text-sm mb-2 text-zinc-700 dark:text-zinc-300 font-semibold">
                  Imagen del producto
                </label>

                <div className="flex justify-center items-center gap-3 mb-3">
                  <label className="flex items-center justify-center px-3 py-1.5 rounded-md bg-yellow-500 hover:bg-yellow-600 text-black text-xs font-medium cursor-pointer transition">
                    <Upload size={14} strokeWidth={1.8} /> Seleccionar imagen
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageSelect}
                    />
                  </label>

                  {imagenPreview && (
                    <button
                      onClick={() => {
                        setImagenFile(null);
                        setImagenPreview(null);
                      }}
                      className="px-3 py-1.5 rounded-md bg-red-600 hover:bg-red-700 text-white text-xs font-medium transition"
                    >
                      <Trash2 size={14} strokeWidth={1.8} /> Quitar
                    </button>
                  )}
                </div>

                {imagenPreview ? (
                  <img
                    src={imagenPreview}
                    alt="Preview"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        "/placeholder-image.png";
                    }}
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

                {specFile || specFileUrl ? (
                  <div className="flex flex-col items-center gap-2 text-sm">
                    <div className="flex gap-3">
                      <button
                        onClick={() =>
                          window.open(
                            specFile
                              ? URL.createObjectURL(specFile)
                              : specFileUrl!,
                            "_blank"
                          )
                        }
                        className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition"
                      >
                        <Eye size={14} strokeWidth={1.8} /> Ver
                      </button>
                      <button
                        onClick={() => {
                          setSpecFile(null);
                          setSpecFileUrl(null);
                        }}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-red-600 hover:bg-red-700 text-white text-xs font-medium transition"
                      >
                        <Trash2 size={14} strokeWidth={1.8} /> Quitar
                      </button>
                    </div>
                    <p className="text-xs text-zinc-500 truncate max-w-[230px] text-center mt-1">
                      {specFile
                        ? specFile.name
                        : decodeURIComponent(
                            specFileUrl?.split("/").pop() || ""
                          )}
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
                disabled={isSubmitting}
                className={`px-4 py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                  isSubmitting
                    ? "bg-yellow-400 text-black opacity-70 cursor-not-allowed"
                    : "bg-yellow-500 hover:bg-yellow-600 text-black"
                }`}
                onClick={() => setShowSaveConfirm(true)}
              >
                {isSubmitting ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </div>
        </div>
      </Dialog>

      {/* Confirmación Guardar */}
      {showSaveConfirm && (
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
                onClick={handleUpdate}
                disabled={isSubmitting}
                className="px-4 py-2 bg-yellow-500 text-black hover:bg-yellow-600 rounded-lg font-semibold transition"
              >
                {isSubmitting ? "Guardando..." : "Sí, guardar"}
              </button>
            </div>
          </div>
        </Dialog>
      )}

      {/* Confirmación Cancelar */}
      {showCancelConfirm && (
        <Dialog
          open={showCancelConfirm}
          onClose={() => setShowCancelConfirm(false)}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-xl w-full max-w-sm relative z-10">
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
                className="px-4 py-2 bg-red-500 text-white hover:bg-red-600 rounded-lg font-semibold transition"
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
      )}

      {/* Confirmación Guardar */}
      {showSaveConfirm && (
        <Dialog
          open={showSaveConfirm}
          onClose={() => setShowSaveConfirm(false)}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-xl w-full max-w-sm relative z-10">
            <Dialog.Title className="text-lg font-bold text-center mb-4 text-zinc-900 dark:text-white">
              ¿Guardar cambios?
            </Dialog.Title>
            <p className="text-center text-sm mb-6 text-zinc-700 dark:text-zinc-300">
              Se sobrescribirá la información del producto.
            </p>
            <div className="flex justify-center gap-3">
              <button
                className="px-4 py-2 bg-zinc-200 hover:bg-zinc-300 text-zinc-800 
                     dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:text-white 
                     rounded-lg transition"
                onClick={() => setShowSaveConfirm(false)}
              >
                Cancelar
              </button>
              <button
                onClick={handleUpdate}
                disabled={isSubmitting}
                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 
                     text-black dark:text-black 
                     rounded-lg font-semibold transition"
              >
                {isSubmitting ? "Guardando..." : "Sí, guardar"}
              </button>
            </div>
          </div>
        </Dialog>
      )}

      {/* Confirmación Cancelar */}
      {showCancelConfirm && (
        <Dialog
          open={showCancelConfirm}
          onClose={() => setShowCancelConfirm(false)}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-xl w-full max-w-sm relative z-10">
            <Dialog.Title className="text-lg font-bold text-center mb-4 text-zinc-900 dark:text-white">
              ¿Cancelar edición?
            </Dialog.Title>
            <p className="text-center text-sm mb-6 text-zinc-700 dark:text-zinc-300">
              Los cambios no guardados se perderán.
            </p>
            <div className="flex justify-center gap-3">
              <button
                className="px-4 py-2 bg-zinc-200 hover:bg-zinc-300 text-zinc-800 
                     dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:text-white 
                     rounded-lg transition"
                onClick={() => setShowCancelConfirm(false)}
              >
                Volver
              </button>
              <button
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white 
                     rounded-lg font-semibold transition"
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
      )}

      {/* Confirmación Eliminar */}
      {showDeleteConfirm && (
        <Dialog
          open={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-xl w-full max-w-sm relative z-10">
            <Dialog.Title className="text-lg font-bold text-center mb-4 text-red-600 dark:text-red-400">
              ¿Eliminar producto?
            </Dialog.Title>
            <p className="text-center text-sm mb-6 text-zinc-700 dark:text-zinc-300">
              Estás a punto de eliminar{" "}
              <span className="font-semibold text-red-600 dark:text-red-400">
                {producto?.nombre}
              </span>
              . Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-center gap-3">
              <button
                className="px-4 py-2 bg-zinc-200 hover:bg-zinc-300 text-zinc-800 
                     dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:text-white 
                     rounded-lg transition"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white 
                     rounded-lg font-semibold transition"
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
      )}
    </>
  );
}
