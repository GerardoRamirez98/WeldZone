import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingCart,
  Search,
  MessageCircle,
  FileText,
  CreditCard,
  Truck,
  ShieldCheck,
} from "lucide-react";
import { useConfig } from "@/hooks/useConfig";

export default function ComoComprar() {
  useEffect(() => {
    document.title = "Cómo comprar | WeldZone";
  }, []);

  const { config } = useConfig();
  const whatsappHref = useMemo(() => {
    const raw = config?.whatsapp?.replace(/[^\d]/g, "");
    if (!raw) return undefined;
    const msg = "Hola, quiero cotizar/comprar productos de su catálogo.";
    return `https://wa.me/${raw}?text=${encodeURIComponent(msg)}`;
  }, [config?.whatsapp]);

  const steps = [
    {
      title: "Explora el catálogo",
      desc:
        "Usa el buscador y los filtros por categoría, precio o etiquetas para encontrar tus productos.",
      icon: <Search className="w-5 h-5" />,
    },
    {
      title: "Agrega al carrito",
      desc:
        "En cada producto presiona ‘Agregar’. Puedes ajustar cantidades desde el carrito.",
      icon: <ShoppingCart className="w-5 h-5" />,
    },
    {
      title: "Abre tu carrito",
      desc:
        "Toca el botón flotante verde con el ícono del carrito para ver tu selección.",
      icon: <ShoppingCart className="w-5 h-5" />,
    },
    {
      title: "Envía tu pedido",
      desc:
        "Desde el carrito, pulsa ‘Enviar pedido por WhatsApp’. Te atenderemos para confirmar disponibilidad y tiempos.",
      icon: <MessageCircle className="w-5 h-5" />,
    },
    {
      title: "Cotización y pago",
      desc:
        "Recibirás la cotización y los datos de pago. Aceptamos transferencia. Facturación disponible.",
      icon: <CreditCard className="w-5 h-5" />,
    },
    {
      title: "Recolección en tienda",
      desc:
        "Actualmente no realizamos envíos. Coordinamos contigo día y horario para recoger tu pedido en el negocio.",
      icon: <Truck className="w-5 h-5" />,
    },
  ];

  return (
    <main className="container py-8">
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Cómo cotizar y comprar</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl">
          Sigue estos pasos para solicitar una cotización o completar tu compra de forma rápida y sencilla.
        </p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {steps.map((s) => (
          <article
            key={s.title}
            className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 flex gap-3"
          >
            <div className="shrink-0 rounded-xl bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 p-2">
              {s.icon}
            </div>
            <div>
              <h3 className="font-semibold">{s.title}</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">{s.desc}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 bg-zinc-50 dark:bg-zinc-950">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <FileText className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
            Detalles importantes
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-zinc-700 dark:text-zinc-300 list-disc pl-5">
            <li>Los precios mostrados incluyen IVA, salvo indicación en contrario.</li>
            <li>Algunos productos pueden requerir confirmación de disponibilidad.</li>
            <li>Facturación: comparte tus datos fiscales al confirmar la compra.</li>
            <li>Garantía de fabricante y soporte técnico según producto.</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 bg-white dark:bg-zinc-900">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
            ¿Listo para empezar?
          </h2>
          <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
            Explora el catálogo y agrega tus productos. Si lo prefieres, escríbenos directo y te guiamos.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              to="/catalogo"
              className="inline-flex items-center justify-center rounded-xl bg-yellow-500 hover:bg-yellow-600 text-zinc-900 font-semibold px-4 py-2"
            >
              Ver catálogo
            </Link>
            {whatsappHref && (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl bg-white dark:bg-white !text-black border border-zinc-200 dark:border-zinc-700 px-4 py-2 font-semibold"
              >
                Consultar por WhatsApp
              </a>
            )}
            <Link
              to="/contacto"
              className="inline-flex items-center justify-center rounded-xl border border-zinc-300 dark:border-zinc-700 px-4 py-2 text-sm"
            >
              Ver ubicación y horarios
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
