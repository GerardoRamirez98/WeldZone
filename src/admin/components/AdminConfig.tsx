// src/admin/components/AdminConfig.tsx
import { categorias, etiquetas, etiquetaColors } from "../../data/options";

export default function AdminConfig() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-6">Panel de Configuración</h1>

      {/* Sección Categorías */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Categorías disponibles</h2>
        <ul className="list-disc list-inside space-y-1 text-zinc-700 dark:text-zinc-300">
          {categorias.map((cat) => (
            <li key={cat}>{cat}</li>
          ))}
        </ul>
      </section>

      {/* Sección Etiquetas */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Etiquetas y Colores</h2>
        <ul className="space-y-2">
          {etiquetas.map((etiqueta) => (
            <li
              key={etiqueta}
              className={`flex items-center gap-2 px-3 py-2 rounded-md w-fit ${etiquetaColors[etiqueta]}`}
            >
              <span className="font-medium">{etiqueta}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Espacio futuro para más configuraciones */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Próximamente</h2>
        <p className="text-sm text-zinc-500">
          Aquí podrás agregar más configuraciones del sistema.
        </p>
      </section>
    </div>
  );
}
