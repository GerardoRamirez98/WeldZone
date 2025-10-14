import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Plus,
  Phone,
  Loader2,
  Save,
  Trash2,
  Pencil,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminConfig() {
  const [whatsapp, setWhatsapp] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Estados dinámicos
  const [categorias, setCategorias] = useState<
    { id: number; nombre: string }[]
  >([]);
  const [etiquetas, setEtiquetas] = useState<
    { id: number; nombre: string; color: string }[]
  >([]);
  const [newCategoria, setNewCategoria] = useState("");
  const [newEtiqueta, setNewEtiqueta] = useState({
    nombre: "",
    color: "#000000",
  });
  const [editingCategoriaId, setEditingCategoriaId] = useState<number | null>(
    null
  );
  const [editingEtiquetaId, setEditingEtiquetaId] = useState<number | null>(
    null
  );
  const [editNombre, setEditNombre] = useState("");

  // Modal de confirmación
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: number;
    type: "categoria" | "etiqueta";
    nombre: string;
  } | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  // 🚀 Cargar configuración
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [configRes, catRes, etqRes] = await Promise.all([
          fetch(`${API_URL}/config`),
          fetch(`${API_URL}/config/categorias`),
          fetch(`${API_URL}/config/etiquetas`),
        ]);

        const config = await configRes.json();
        const categoriasData = await catRes.json();
        const etiquetasData = await etqRes.json();

        setWhatsapp(config.whatsapp || "");
        setCategorias(categoriasData);
        setEtiquetas(etiquetasData);
      } catch {
        toast.error("❌ Error al cargar configuración");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [API_URL]);

  // 💾 Guardar número WhatsApp
  const handleSave = async () => {
    if (!whatsapp.trim()) return toast.warning("⚠️ Ingresa un número válido");
    try {
      setSaving(true);
      const res = await fetch(`${API_URL}/config`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ whatsapp }),
      });
      if (!res.ok) throw new Error();
      localStorage.removeItem("weldzone_config");
      toast.success("✅ Número de WhatsApp actualizado");
    } catch {
      toast.error("❌ Error al guardar número");
    } finally {
      setSaving(false);
    }
  };

  // ➕ Agregar etiqueta
  const handleAddEtiqueta = async () => {
    if (!newEtiqueta.nombre.trim())
      return toast.warning("⚠️ Ingresa un nombre válido");
    try {
      const res = await fetch(`${API_URL}/config/etiquetas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEtiqueta),
      });
      const data = await res.json();
      setEtiquetas((prev) => [...prev, data]);
      setNewEtiqueta({ nombre: "", color: "#000000" });
      toast.success("✅ Etiqueta agregada");
    } catch {
      toast.error("❌ Error al agregar etiqueta");
    }
  };

  // ➕ Agregar categoría
  const handleAddCategoria = async () => {
    if (!newCategoria.trim())
      return toast.warning("⚠️ Ingresa un nombre válido");
    try {
      const res = await fetch(`${API_URL}/config/categorias`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: newCategoria }),
      });
      const data = await res.json();
      setCategorias((prev) => [...prev, data]);
      setNewCategoria("");
      toast.success("✅ Categoría agregada");
    } catch {
      toast.error("❌ Error al agregar categoría");
    }
  };

  // ✏️ Editar nombre categoría
  const handleUpdateCategoria = async (id: number, nombre: string) => {
    try {
      const res = await fetch(`${API_URL}/config/categorias/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre }),
      });
      if (!res.ok) throw new Error();
      setCategorias((prev) =>
        prev.map((c) => (c.id === id ? { ...c, nombre } : c))
      );
      setEditingCategoriaId(null);
      toast.success("✅ Categoría actualizada");
    } catch {
      toast.error("❌ Error al actualizar categoría");
    }
  };

  // ✏️ Editar nombre etiqueta
  const handleUpdateEtiquetaNombre = async (id: number, nombre: string) => {
    try {
      const res = await fetch(`${API_URL}/config/etiquetas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre }),
      });
      if (!res.ok) throw new Error();
      setEtiquetas((prev) =>
        prev.map((e) => (e.id === id ? { ...e, nombre } : e))
      );
      setEditingEtiquetaId(null);
      toast.success("✅ Nombre de etiqueta actualizado");
    } catch {
      toast.error("❌ Error al actualizar nombre de etiqueta");
    }
  };

  // 🎨 Cambiar color etiqueta
  const handleColorChange = async (id: number, color: string) => {
    try {
      const res = await fetch(`${API_URL}/config/etiquetas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ color }),
      });
      if (!res.ok) throw new Error();
      setEtiquetas((prev) =>
        prev.map((e) => (e.id === id ? { ...e, color } : e))
      );
      toast.success("🎨 Color actualizado");
    } catch {
      toast.error("❌ Error al actualizar color");
    }
  };

  // 🗑️ Mostrar modal confirmación
  const handleDeleteCategoria = (id: number, nombre: string) => {
    setDeleteTarget({ id, type: "categoria", nombre });
    setShowDeleteConfirm(true);
  };

  const handleDeleteEtiqueta = (id: number, nombre: string) => {
    setDeleteTarget({ id, type: "etiqueta", nombre });
    setShowDeleteConfirm(true);
  };

  // Confirmar eliminación
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      const endpoint =
        deleteTarget.type === "categoria"
          ? `${API_URL}/config/categorias/${deleteTarget.id}`
          : `${API_URL}/config/etiquetas/${deleteTarget.id}`;

      const res = await fetch(endpoint, { method: "DELETE" });
      if (!res.ok) throw new Error();

      if (deleteTarget.type === "categoria")
        setCategorias((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      else setEtiquetas((prev) => prev.filter((e) => e.id !== deleteTarget.id));

      toast.success(
        `🗑️ ${
          deleteTarget.type === "categoria" ? "Categoría" : "Etiqueta"
        } eliminada correctamente`
      );
    } catch {
      toast.error("❌ Error al eliminar");
    } finally {
      setShowDeleteConfirm(false);
      setDeleteTarget(null);
    }
  };

  // ==============================
  // 📦 Renderizado
  // ==============================
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Configuración del Sistema</h1>

      {/* 🔹 WhatsApp */}
      <div className="bg-white dark:bg-zinc-800 shadow-md rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Phone className="text-green-600" size={20} />
          <h2 className="text-lg font-semibold">Número de WhatsApp</h2>
        </div>
        {loading ? (
          <div className="flex items-center gap-2 text-zinc-500">
            <Loader2 className="animate-spin" size={18} />
            Cargando configuración...
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <input
              type="text"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="Ejemplo: 5214742564738"
              className="w-full sm:max-w-xs rounded-lg border bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:border-emerald-600 transition"
            />
            <button
              onClick={handleSave}
              disabled={saving}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition ${
                saving
                  ? "bg-emerald-700 text-white opacity-70 cursor-not-allowed"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white"
              }`}
            >
              {saving ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  Guardando...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Guardar cambios
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* 🔹 Categorías */}
      <div className="bg-white dark:bg-zinc-800 shadow-md rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Categorías disponibles</h2>
          <div className="flex gap-2">
            <input
              value={newCategoria}
              onChange={(e) => setNewCategoria(e.target.value)}
              placeholder="Nueva categoría"
              className="rounded-lg border bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 px-3 py-1 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:border-emerald-600 transition"
            />
            <button
              onClick={handleAddCategoria}
              className="flex items-center gap-2 px-3 py-1 text-sm rounded-md bg-yellow-500 hover:bg-yellow-600 text-black font-medium transition"
            >
              <Plus size={16} /> Agregar
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {categorias.map((cat) => (
            <div
              key={cat.id}
              className="flex justify-between items-center px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 font-medium"
            >
              {editingCategoriaId === cat.id ? (
                <input
                  value={editNombre}
                  onChange={(e) => setEditNombre(e.target.value)}
                  onBlur={() => handleUpdateCategoria(cat.id, editNombre)}
                  className="flex-1 bg-transparent outline-none border-b border-emerald-500 text-sm"
                  autoFocus
                />
              ) : (
                <span>{cat.nombre}</span>
              )}

              <div className="flex gap-2 items-center">
                <button
                  onClick={() => {
                    setEditingCategoriaId(cat.id);
                    setEditNombre(cat.nombre);
                  }}
                  className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => handleDeleteCategoria(cat.id, cat.nombre)}
                  className="p-1 rounded hover:bg-red-200 dark:hover:bg-red-800 transition"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🔹 Etiquetas */}
      <div className="bg-white dark:bg-zinc-800 shadow-md rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Etiquetas y Colores</h2>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Etiqueta"
              value={newEtiqueta.nombre}
              onChange={(e) =>
                setNewEtiqueta({ ...newEtiqueta, nombre: e.target.value })
              }
              className="rounded-lg border bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 px-3 py-1 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:border-emerald-600 transition"
            />
            <input
              type="color"
              value={newEtiqueta.color}
              onChange={(e) =>
                setNewEtiqueta({ ...newEtiqueta, color: e.target.value })
              }
              className="w-10 h-9 p-0 border rounded-md cursor-pointer border-zinc-300 dark:border-zinc-700"
            />
            <button
              onClick={handleAddEtiqueta}
              className="flex items-center gap-2 px-3 py-1 text-sm rounded-md bg-yellow-500 hover:bg-yellow-600 text-black font-medium transition"
            >
              <Plus size={16} /> Agregar
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {etiquetas.map((etiqueta) => (
            <div
              key={etiqueta.id}
              className="flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-white"
              style={{ backgroundColor: etiqueta.color }}
            >
              {editingEtiquetaId === etiqueta.id ? (
                <input
                  value={editNombre}
                  onChange={(e) => setEditNombre(e.target.value)}
                  onBlur={() =>
                    handleUpdateEtiquetaNombre(etiqueta.id, editNombre)
                  }
                  className="flex-1 bg-transparent outline-none border-b border-white text-sm text-white placeholder:text-zinc-200"
                  autoFocus
                />
              ) : (
                <span>{etiqueta.nombre}</span>
              )}

              <input
                type="color"
                value={etiqueta.color}
                onChange={(e) => handleColorChange(etiqueta.id, e.target.value)}
                className="w-5 h-5 p-0 border-none bg-transparent cursor-pointer"
              />
              <button
                onClick={() => {
                  setEditingEtiquetaId(etiqueta.id);
                  setEditNombre(etiqueta.nombre);
                }}
                className="p-1 rounded-full bg-white/20 hover:bg-white/40 transition"
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={() =>
                  handleDeleteEtiqueta(etiqueta.id, etiqueta.nombre)
                }
                className="p-1 rounded-full bg-white/20 hover:bg-white/40 transition"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 🧩 Modal Confirmación */}
      <Dialog.Root open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
          <Dialog.Content
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
                       bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-xl 
                       z-50 w-[90%] max-w-sm text-center"
          >
            <Dialog.Title className="text-lg font-bold text-red-600 flex items-center justify-center gap-2 mb-3">
              <XCircle className="w-5 h-5" /> Confirmar eliminación
            </Dialog.Title>
            <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-6">
              ¿Deseas eliminar{" "}
              <span className="font-semibold text-red-500">
                {deleteTarget?.nombre}
              </span>
              ?<br />
              Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-zinc-700 text-white rounded-lg hover:bg-zinc-800 transition"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
              >
                Sí, eliminar
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
