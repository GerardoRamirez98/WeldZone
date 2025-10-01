/**
 * Página: About
 * Aquí explicamos de forma clara quién es WeldZone
 * y cuál es la finalidad de la aplicación.
 */

export default function About() {
  return (
    <div className="container mx-auto py-12 px-4 text-center">
      {/* Título principal */}
      <h1 className="text-4xl font-bold mb-6 text-emerald-600 dark:text-emerald-400">
        Sobre WeldZone
      </h1>

      {/* Descripción */}
      <p className="text-lg text-zinc-700 dark:text-zinc-300 max-w-3xl mx-auto mb-10">
        WeldZone es una plataforma diseñada para soldadores y empresas del ramo.
        Nuestro objetivo es ofrecer un catálogo claro, profesional y actualizado
        de herramientas y accesorios para soldadura, con un panel de
        administración para gestionar productos de manera sencilla.
      </p>

      {/* Tarjetas informativas (ejemplo de sección profesional) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        <div className="rounded-xl border bg-white dark:bg-zinc-900 shadow p-6">
          <h2 className="text-xl font-semibold mb-2">Catálogo Online</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Explora productos con un diseño responsivo y moderno, adaptado para
            cualquier dispositivo.
          </p>
        </div>

        <div className="rounded-xl border bg-white dark:bg-zinc-900 shadow p-6">
          <h2 className="text-xl font-semibold mb-2">Administración</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Agrega, edita o elimina productos desde un panel fácil de usar con
            formularios optimizados.
          </p>
        </div>

        <div className="rounded-xl border bg-white dark:bg-zinc-900 shadow p-6">
          <h2 className="text-xl font-semibold mb-2">Visión</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Crear la mejor experiencia digital para el soldador profesional,
            conectando tecnología con herramientas.
          </p>
        </div>
      </div>
    </div>
  );
}
