// src/admin/pages/AdminConfig.tsx
import { categorias, etiquetas, etiquetaColors } from "../../data/options";
import { Plus, Edit } from "lucide-react";

export default function AdminConfig() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Configuración del Sistema</h1>

      {/* Tarjeta Categorías */}
      <div className="bg-white dark:bg-zinc-800 shadow-md rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Categorías disponibles</h2>
          <button className="flex items-center gap-2 px-3 py-1 text-sm rounded-md bg-yellow-500 hover:bg-yellow-600 text-black font-medium transition">
            <Plus size={16} /> Agregar
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {categorias.map((cat) => (
            <div
              key={cat}
              className="flex justify-between items-center px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 font-medium"
            >
              <span>{cat}</span>
              <button className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 transition">
                <Edit size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Tarjeta Etiquetas */}
      <div className="bg-white dark:bg-zinc-800 shadow-md rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Etiquetas y Colores</h2>
          <button className="flex items-center gap-2 px-3 py-1 text-sm rounded-md bg-yellow-500 hover:bg-yellow-600 text-black font-medium transition">
            <Plus size={16} /> Agregar
          </button>
        </div>
        <div className="flex flex-wrap gap-3">
          {etiquetas.map((etiqueta) => (
            <div
              key={etiqueta}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold ${etiquetaColors[etiqueta]}`}
            >
              {etiqueta}
              <button className="p-1 rounded-full bg-white/20 hover:bg-white/40 transition">
                <Edit size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Tarjeta futura */}
      <div className="bg-white dark:bg-zinc-800 shadow-md rounded-xl p-5">
        <h2 className="text-lg font-semibold mb-2">Próximamente</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Aquí podrás administrar más configuraciones del sistema.
        </p>
      </div>
    </div>
  );
}
