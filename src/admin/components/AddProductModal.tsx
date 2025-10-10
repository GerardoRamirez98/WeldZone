import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { Camera, Upload, Trash2, Eye, FilePlus2 } from "lucide-react";
import type { Product, NewProduct } from "../../types/products";
import { categorias, etiquetas } from "../../data/options";
import { createProduct } from "../../api/products.api";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (producto: Product) => void;
}

// 📦 1. Función para subir el archivo PDF/DOCX a tu backend
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

// 📎 2. Helper para obtener el path interno desde la URL pública de Supabase
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

export default function AddProductModal({
  isOpen,
  onClose,
  onAdd,
}: AddProductModalProps) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState<number>(0);

  const [precioInput, setPrecioInput] = useState(precio.toString());

  const [stock, setStock] = useState<number>(0);

  const [stockInput, setStockInput] = useState(stock.toString());

  const [categoria, setCategoria] = useState("General");
  const [etiqueta, setEtiqueta] = useState<"Nuevo" | "Oferta" | undefined>();
  // 📸 Estado para imagen
  const [imagenFile, setImagenFile] = useState<File | null>(null);
  const [imagenPreview, setImagenPreview] = useState<string | null>(null);

  // 📄 Estado para archivo de especificaciones
  const [specFileUrl, setSpecFileUrl] = useState<string | null>(null);

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
    setSpecFileUrl(null);
  };

  useEffect(() => {
    if (isOpen) resetForm();
  }, [isOpen]);

  // 📸 Vista previa y carga de imagen
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagenFile(file);
      setImagenPreview(URL.createObjectURL(file));
      toast.success("📸 Imagen cargada correctamente");
    }
  };

  // 📄 Vista previa y carga de archivo de especificaciones
  const handleSpecUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      toast.message("📤 Subiendo archivo de especificaciones...");
      const url = await uploadSpecFile(file);
      setSpecFileUrl(url);
      toast.success(`✅ ${file.name} subido correctamente`); // 👈 muestra el nombre del archivo
    } catch (err) {
      console.error(err);
      toast.error("❌ Error al subir archivo de especificaciones");
    }
  };

  // 📤 Crear producto con indicador de carga
  const handleSubmit = async () => {
    if (!nombre) {
      toast.warning("⚠️ El nombre es obligatorio");
      return;
    }

    if (precio <= 0) {
      toast.warning("⚠️ El precio debe ser mayor a 0");
      return;
    }

    if (stock < 0) {
      toast.warning("⚠️ El stock no puede ser negativo");
      return;
    }

    const toastId = toast.loading("Subiendo producto...");

    try {
      let imagenUrl: string | undefined;

      // 1️⃣ Subir imagen al backend (si existe)
      if (imagenFile) {
        toast.message("📤 Subiendo imagen...");
        const formData = new FormData();
        formData.append("file", imagenFile);

        const res = await fetch(`${API_URL}/upload`, {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error("Error al subir la imagen al backend");

        const data = await res.json();
        imagenUrl = data.url;
        toast.success("✅ Imagen subida correctamente", { id: toastId });
      }

      // 2️⃣ Crear producto
      const nuevoProducto: NewProduct = {
        nombre,
        descripcion: descripcion || "Sin descripción",
        precio,
        stock,
        categoria,
        etiqueta,
        imagenUrl,
        specFileUrl,
        estado: "Activo",
      };

      const productoCreado = await createProduct(nuevoProducto);

      // 3️⃣ Actualizar UI
      onAdd(productoCreado);
      toast.success("✅ Producto creado correctamente", { id: toastId });
      resetForm();
      setShowSaveConfirm(false);
      onClose();
    } catch {
      toast.error("❌ Error al crear el producto o subir la imagen.", {
        id: toastId,
      });
    }
  };

  return (
    <>
      {/* 🧾 Modal */}
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
            {/* 🧱 Columna izquierda */}
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

              {/* 💲 Precio y Stock */}
              <div className="grid grid-cols-2 gap-4 mt-4">
                {/* Precio */}
                <div className="relative">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={precioInput}
                    onChange={(e) => {
                      const value = e.target.value.replace(",", ".");
                      if (/^[0-9]*[.,]?[0-9]*$/.test(value))
                        setPrecioInput(value);
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
                      if (/^\d*$/.test(value)) setStockInput(value);
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

            {/* 🧩 Columna derecha */}
            <div className="flex flex-col gap-6">
              {/* 📎 Archivo de especificaciones */}
              <div className="flex flex-col items-center w-full mt-2">
                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-200 mb-2 flex items-center gap-1">
                  <FilePlus2 className="w-4 h-4 text-yellow-500" />
                  Archivo de especificaciones
                </label>

                {specFileUrl ? (
                  <div className="flex flex-col items-center gap-2 text-sm">
                    <div className="flex gap-3 items-center justify-center">
                      {/* 👁️ Ver archivo */}
                      <div className="relative group">
                        <label
                          onClick={() => window.open(specFileUrl, "_blank")}
                          className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium transition text-xs cursor-pointer shadow-sm"
                        >
                          <Eye size={14} strokeWidth={1.8} />
                          Ver
                        </label>
                        <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-zinc-400 opacity-0 group-hover:opacity-100 transition">
                          Abrir archivo
                        </span>
                      </div>

                      {/* 🗑️ Quitar archivo */}
                      <div className="relative group">
                        <label
                          onClick={() => {
                            setSpecFileUrl(null);
                            toast.info(
                              "🗑️ Archivo de especificaciones eliminado"
                            );
                          }}
                          className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-md bg-red-600 hover:bg-red-700 text-white font-medium transition text-xs cursor-pointer shadow-sm"
                        >
                          <Trash2 size={14} strokeWidth={1.8} />
                          Quitar
                        </label>
                        <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-zinc-400 opacity-0 group-hover:opacity-100 transition">
                          Eliminar archivo
                        </span>
                      </div>
                    </div>

                    {/* 📄 Nombre del archivo */}
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

              {/* 📸 Imagen del producto */}
              <div className="flex flex-col items-center justify-center">
                <label className="text-sm mb-2 text-zinc-600 dark:text-zinc-400 font-semibold">
                  Imagen del producto
                </label>

                <div className="flex flex-wrap justify-center gap-2 mb-3">
                  {/* Botón Tomar foto */}
                  <label className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-yellow-500 text-black text-xs font-medium hover:bg-yellow-600 cursor-pointer transition">
                    <Camera size={14} strokeWidth={1.5} />
                    <span>Tomar</span>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>

                  {/* Botón Subir archivo */}
                  <label className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-zinc-700 text-white text-xs font-medium hover:bg-zinc-600 cursor-pointer transition">
                    <span>📁 Subir</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>

                {/* Vista previa */}
                {imagenPreview ? (
                  <img
                    src={imagenPreview}
                    alt="Preview"
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
