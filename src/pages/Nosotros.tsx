// src/pages/Nosotros.tsx
import { useEffect } from "react";
import { Factory, Shield, Wrench, Zap } from "lucide-react";

export default function Nosotros() {
  useEffect(() => {
    document.title = "Nosotros | WeldZone";
  }, []);

  return (
    <main className="container mx-auto px-4 py-16">
      {/* 🚀 Sección principal */}
      <section className="text-center mb-20">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          Conoce a{" "}
          <span className="text-yellow-500 dark:text-yellow-400">WeldZone</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed">
          En <strong>WeldZone</strong> impulsamos el trabajo del soldador
          profesional con equipos industriales, consumibles de alto rendimiento
          y soluciones pensadas para durar. Nuestra misión es simplificar la
          adquisición de herramientas y materiales con una plataforma moderna,
          intuitiva y confiable.
        </p>
      </section>

      {/* 🛠️ Misión y Visión */}
      <section className="grid gap-8 md:grid-cols-2 mb-20">
        <InfoCard
          title="Nuestra Misión"
          text="Ser la opción más confiable en el suministro de productos y herramientas para soldadura, combinando calidad, innovación y atención personalizada que marque la diferencia."
        />
        <InfoCard
          title="Nuestra Visión"
          text="Convertirnos en un referente nacional e internacional, elevando los estándares del sector con innovación constante y soporte técnico especializado."
        />
      </section>

      {/* 🧠 Valores principales */}
      <section>
        <h2 className="text-center text-3xl font-bold mb-12 text-zinc-900 dark:text-white">
          🔩 Lo que nos define
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <ValueCard
            icon={<Shield className="w-10 h-10 text-yellow-500" />}
            title="Calidad Garantizada"
            text="Cada producto pasa por estándares industriales para asegurar un desempeño confiable en cada soldadura."
          />
          <ValueCard
            icon={<Factory className="w-10 h-10 text-yellow-500" />}
            title="Innovación Constante"
            text="Nos mantenemos a la vanguardia con tecnología moderna para los desafíos actuales del sector."
          />
          <ValueCard
            icon={<Wrench className="w-10 h-10 text-yellow-500" />}
            title="Soporte Especializado"
            text="Acompañamos a cada cliente con asesoría técnica y atención directa de expertos en soldadura."
          />
          <ValueCard
            icon={<Zap className="w-10 h-10 text-yellow-500" />}
            title="Eficiencia y Potencia"
            text="Nuestros productos están diseñados para maximizar resultados, porque sabemos que el tiempo es oro."
          />
        </div>
      </section>

      {/* 📞 Llamado a la acción */}
      <section className="mt-24 text-center">
        <h2 className="text-3xl font-bold mb-4 text-zinc-900 dark:text-white">
          ⚙️ ¿Listo para potenciar tu taller?
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-8">
          Ya sea que estés comenzando o seas un profesional consolidado, en{" "}
          <strong>WeldZone</strong> encontrarás el equipo, conocimiento y
          soporte que tu negocio necesita.
        </p>
        <a
          href="https://wa.me/524741129867"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-yellow-500 hover:bg-yellow-600 text-zinc-900 font-semibold px-8 py-4 rounded-full transition transform hover:scale-105 shadow-md"
        >
          📲 Contáctanos por WhatsApp
        </a>
      </section>
    </main>
  );
}

// 🧱 Componentes internos
function InfoCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 hover:shadow-lg transition">
      <h2 className="text-2xl font-bold mb-4 text-yellow-500">{title}</h2>
      <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">{text}</p>
    </div>
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
