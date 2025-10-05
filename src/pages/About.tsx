// src/pages/About.tsx
import { Factory, Shield, Wrench, Zap } from "lucide-react";

export default function About() {
  return (
    <main className="container mx-auto px-4 py-16">
      {/* 🚀 Sección principal */}
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          Sobre{" "}
          <span className="text-yellow-500 dark:text-yellow-400">WeldZone</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed">
          En <strong>WeldZone</strong> impulsamos el trabajo del soldador
          profesional con equipos industriales, consumibles de alto rendimiento
          y soluciones diseñadas para durar. Nuestra plataforma está pensada
          para ser moderna, intuitiva y confiable, optimizando cada proyecto de
          soldadura.
        </p>
      </section>

      {/* 🛠️ Misión y Visión */}
      <section className="grid gap-8 md:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="text-2xl font-bold mb-4 text-yellow-500">
            Nuestra Misión
          </h2>
          <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
            Ser la opción más confiable en el suministro de productos y
            herramientas para soldadura, ofreciendo calidad, innovación y un
            servicio al cliente que marque la diferencia en la industria.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="text-2xl font-bold mb-4 text-yellow-500">
            Nuestra Visión
          </h2>
          <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
            Convertirnos en un referente nacional e internacional, elevando los
            estándares del sector con innovación constante, soporte técnico
            especializado y productos que potencien la productividad de cada
            cliente.
          </p>
        </div>
      </section>

      {/* 🧠 Valores principales */}
      <section className="mt-20">
        <h2 className="text-center text-3xl font-bold mb-10">
          🔩 Lo que nos define
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <ValueCard
            icon={<Shield className="w-10 h-10 text-yellow-500" />}
            title="Calidad Garantizada"
            text="Cada producto que ofrecemos pasa por estándares industriales para asegurar un desempeño superior en cada soldadura."
          />
          <ValueCard
            icon={<Factory className="w-10 h-10 text-yellow-500" />}
            title="Innovación Constante"
            text="Nos mantenemos a la vanguardia con tecnología de punta para los retos actuales del sector."
          />
          <ValueCard
            icon={<Wrench className="w-10 h-10 text-yellow-500" />}
            title="Soporte Especializado"
            text="Acompañamos a nuestros clientes en cada etapa con asesoría técnica y atención personalizada."
          />
          <ValueCard
            icon={<Zap className="w-10 h-10 text-yellow-500" />}
            title="Eficiencia y Potencia"
            text="Sabemos que el tiempo es oro: nuestros productos están diseñados para maximizar resultados."
          />
        </div>
      </section>

      {/* 📞 Llamado a la acción */}
      <section className="mt-24 text-center">
        <h2 className="text-3xl font-bold mb-4">
          ⚙️ ¿Listo para potenciar tu taller?
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-8">
          Ya sea que estés iniciando o seas un profesional consolidado, en{" "}
          <strong>WeldZone</strong> tenemos el equipo, el conocimiento y la
          experiencia que tu negocio necesita.
        </p>
        <a
          href="https://wa.me/524741129867"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-yellow-500 hover:bg-yellow-600 text-zinc-900 font-bold px-8 py-4 rounded-full transition transform hover:scale-105"
        >
          📲 Contáctanos por WhatsApp
        </a>
      </section>
    </main>
  );
}

function ValueCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex flex-col items-center text-center p-6 rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950 hover:shadow-lg transition">
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-bold mb-2 text-yellow-500">{title}</h3>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">{text}</p>
    </div>
  );
}
