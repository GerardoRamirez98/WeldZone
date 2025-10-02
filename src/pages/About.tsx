// src/pages/About.tsx
import { MapPin, Mail, Phone, MessageCircle } from "lucide-react";

export default function About() {
  return (
    <main className="container mx-auto px-4 py-12">
      {/* Título */}
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          Sobre{" "}
          <span className="text-emerald-600 dark:text-emerald-400">
            WeldZone
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-700 dark:text-zinc-300">
          En WeldZone ofrecemos soluciones integrales para soldadores y empresas
          del ramo. Nuestro objetivo es brindar equipos, insumos y accesorios de
          calidad, en una plataforma moderna y fácil de usar, siempre con un
          diseño responsivo.
        </p>
      </section>

      {/* Misión y visión */}
      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="text-xl font-bold mb-2">Nuestra Misión</h2>
          <p className="text-zinc-700 dark:text-zinc-300">
            Ser la mejor opción en productos de soldadura en la región,
            garantizando calidad, confianza y atención personalizada para cada
            cliente.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="text-xl font-bold mb-2">Nuestra Visión</h2>
          <p className="text-zinc-700 dark:text-zinc-300">
            Convertirnos en un referente nacional en el suministro de equipos e
            insumos de soldadura, innovando constantemente y ofreciendo un
            servicio excepcional.
          </p>
        </div>
      </section>

      {/* Contacto */}
      <section className="mt-12">
        <h2 className="text-center text-2xl font-bold mb-6">
          📍 Información de contacto
        </h2>
        <div className="max-w-2xl mx-auto space-y-4 text-zinc-700 dark:text-zinc-300">
          <ContactItem
            icon={MapPin}
            text="Margarito González Rubio #1195C, El Refugio, Lagos de Moreno, Jalisco"
          />
          <ContactItem icon={Mail} text="weldzonealtos@gmail.com" />
          <ContactItem icon={Phone} text="Teléfono: 474 117 8597" />
          <ContactItem icon={MessageCircle} text="WhatsApp: 474 112 9867" />
        </div>
      </section>
    </main>
  );
}

function ContactItem({
  icon: Icon,
  text,
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  text: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <Icon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
      <span>{text}</span>
    </div>
  );
}
