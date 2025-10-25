import { useEffect, useMemo } from "react";
import {
  MapPin,
  Phone,
  MessageCircle,
  Facebook,
  Instagram,
  Mail,
  Clock,
  ArrowUpRight,
  Navigation,
  Copy,
} from "lucide-react";
import { useConfig } from "@/hooks/useConfig";
import EstadoTienda from "@/components/EstadoTienda";
import { toast } from "sonner";

export default function Contacto() {
  useEffect(() => {
    document.title = "Contáctanos | WeldZone";
  }, []);

  const { config } = useConfig();

  const rawWhatsapp = config?.whatsapp?.trim() || "";
  const whatsappNumber = useMemo(
    () => rawWhatsapp.replace(/[^\d]/g, ""),
    [rawWhatsapp]
  );

  const whatsappHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        "Hola, quisiera más información sobre sus productos."
      )}`
    : undefined;

  const telHref = whatsappNumber ? `tel:+${whatsappNumber}` : undefined;

  // Formateo simple para mostrar el número (agrupa en bloques básicos)
  const displayPhone = useMemo(() => {
    if (!whatsappNumber) return "No configurado";
    // Si comienza con 52 (México), intenta formatear como +52 474 742 0803
    const n = whatsappNumber;
    if (n.startsWith("52") && n.length >= 12) {
      return `+${n.slice(0, 2)} ${n.slice(2, 5)} ${n.slice(5, 8)} ${n.slice(
        8,
        12
      )}`;
    }
    return `+${n}`;
  }, [whatsappNumber]);

  const addressFull =
    "Margarito González Rubio #1195C, El Refugio, Lagos de Moreno, Jalisco, México";

  // Teléfono fijo mostrado en la tarjeta
  const phoneNumber = "+4741178597";

  // Punto exacto compartido por el cliente (Weldzone Todo Para El Soldador)
  const placeLat = 21.3453314;
  const placeLng = -101.9405819;
  const mapsEmbedSrc = `https://www.google.com/maps?q=${placeLat},${placeLng}&hl=es&z=18&output=embed&maptype=roadmap`;
  const mapsOpenHref =
    "https://www.google.com/maps/place/Weldzone+Todo+Para+El+Soldador/@21.346449,-101.940352,16z/data=!4m14!1m7!3m6!1s0x842bd3cde7aee253:0xdf9582f9a262df12!2sMargarito+Gonz%C3%A1lez+Rubio+1195,+Centro,+47470+Lagos+de+Moreno,+Jal.,+M%C3%A9xico!3b1!8m2!3d21.3463971!4d-101.939964!3m5!1s0x842bd3ce00942fb9:0xe74fb177dc81a1e4!8m2!3d21.3453314!4d-101.9405819!16s%2Fg%2F11p65rrwfz?hl=es&entry=ttu&g_ep=EgoyMDI1MTAyMi4wIKXMDSoASAFQAw%3D%3D";

  const copy = async (label: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`${label} copiado`);
    } catch {
      toast.error("No se pudo copiar");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <section className="container mx-auto px-6 py-10">
        {/* Encabezado */}
        <header className="mb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Contáctanos
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-300 max-w-3xl">
            Estamos para ayudarte. Puedes visitarnos, llamarnos o escribirnos
            por redes sociales.
          </p>
          <p className="mt-3 text-sm md:text-base text-zinc-700 dark:text-zinc-300 max-w-3xl">
            ¡Gracias por tu interés en{" "}
            <span className="font-semibold text-yellow-500">WeldZone</span>! ⚡
            Si tienes dudas, cotizaciones o comentarios, no dudes en
            contactarnos. Nuestro equipo está listo para atenderte por WhatsApp,
            teléfono o redes sociales.
            <span className="block mt-1">
              📍 Visítanos o escríbenos, nos encantará atenderte.
            </span>
          </p>
          <div className="mt-4 flex items-center gap-3 text-sm">
            <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 bg-white/60 dark:bg-zinc-900/40">
              <Clock className="w-4 h-4 text-yellow-500" />
              <EstadoTienda />
            </span>
            {whatsappHref && (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 hover:text-yellow-400 transition-colors"
              >
                <MessageCircle className="w-4 h-4" /> Escribir por WhatsApp
              </a>
            )}
            {telHref && (
              <a
                href={telHref}
                className="inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 hover:text-yellow-400 transition-colors"
              >
                <Phone className="w-4 h-4" /> Llamar
              </a>
            )}
          </div>
        </header>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Columna izquierda: Mapa */}
          <div>
            <iframe
              title="Ubicación de WeldZone"
              src={mapsEmbedSrc}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-[360px] md:h-[440px] lg:h-[520px] rounded-xl shadow-md border border-zinc-200 dark:border-zinc-800"
            />
            <div className="mt-3 flex items-center gap-3">
              <a
                href={mapsOpenHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-zinc-700 dark:text-zinc-300 hover:text-yellow-400 transition-colors"
              >
                Ver en Google Maps <ArrowUpRight className="w-4 h-4" />
              </a>
              <button
                type="button"
                onClick={() => copy("Dirección", addressFull)}
                className="inline-flex items-center gap-1 text-sm text-zinc-700 dark:text-zinc-300 hover:text-yellow-400 transition-colors"
              >
                Copiar dirección <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Columna derecha: Información de contacto */}
          <div className="space-y-4">
            {/* Dirección */}
            <div className="group rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/40 p-4 hover:border-yellow-500/40 transition-colors">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-yellow-500 mt-0.5" />
                <div className="flex-1">
                  <div className="text-yellow-500 font-semibold">Dirección</div>
                  <p className="mt-1 text-sm md:text-[15px]">
                    {addressFull.replace(", México", "")}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-3 text-sm">
                    <a
                      href={mapsOpenHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 hover:text-yellow-400 transition-colors"
                    >
                      Cómo llegar <Navigation className="w-4 h-4" />
                    </a>
                    <button
                      type="button"
                      onClick={() => copy("Dirección", addressFull)}
                      className="inline-flex items-center gap-1 hover:text-yellow-400 transition-colors"
                    >
                      Copiar <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Teléfono / WhatsApp */}
            <div className="group rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/40 p-4 hover:border-yellow-500/40 transition-colors">
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-yellow-500 mt-0.5" />
                <div className="flex-1">
                  <div className="text-yellow-500 font-semibold">
                    Teléfono / WhatsApp
                  </div>
                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center justify-between rounded-md border border-zinc-200 dark:border-zinc-800 px-3 py-1.5">
                      <span className="truncate">
                        <span className="text-zinc-500">Teléfono:</span>{" "}
                        <span className="font-mono">{phoneNumber}</span>
                      </span>
                      {whatsappNumber && (
                        <button
                          type="button"
                          onClick={() => copy("Teléfono", phoneNumber)}
                          aria-label="Copiar teléfono"
                          className="p-1 rounded hover:text-yellow-400 transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div className="flex items-center justify-between rounded-md border border-zinc-200 dark:border-zinc-800 px-3 py-1.5">
                      <span className="truncate">
                        <span className="text-zinc-500">WhatsApp:</span>{" "}
                        <span className="font-mono">{displayPhone}</span>
                      </span>
                      {whatsappNumber && (
                        <button
                          type="button"
                          onClick={() => copy("WhatsApp", `+${whatsappNumber}`)}
                          aria-label="Copiar WhatsApp"
                          className="p-1 rounded hover:text-yellow-400 transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Redes sociales */}
            <div className="group rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/40 p-4 hover:border-yellow-500/40 transition-colors">
              <div className="text-yellow-500 font-semibold mb-1">
                Redes sociales
              </div>
              <div className="flex flex-col gap-2">
                <a
                  href="https://www.facebook.com/WeldZoneLagosDeMoreno"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-yellow-400 transition-colors"
                >
                  <Facebook className="w-5 h-5 text-yellow-500" />{" "}
                  facebook.com/weldzone
                </a>
                <a
                  href="https://www.instagram.com/weldzone.mx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-yellow-400 transition-colors"
                >
                  <Instagram className="w-5 h-5 text-yellow-500" />{" "}
                  instagram.com/weldzone
                </a>
              </div>
            </div>

            {/* Correo */}
            <div className="group rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/40 p-4 hover:border-yellow-500/40 transition-colors">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-yellow-500 mt-0.5" />
                <div className="flex-1">
                  <div className="text-yellow-500 font-semibold">Correo</div>
                  <a
                    href="weldzonealtos@gmail.com"
                    className="mt-1 inline-flex items-center gap-1 hover:text-yellow-400 transition-colors text-sm md:text-[15px]"
                  >
                    weldzonealtos@gmail.com
                  </a>

                  <button
                    type="button"
                    onClick={() => copy("Correo", "weldzonealtos@gmail.com")}
                    className="inline-flex items-center gap-1 text-sm hover:text-yellow-400 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Horarios de atención */}
            <div className="group rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/40 p-4 hover:border-yellow-500/40 transition-colors">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-yellow-500 mt-0.5" />
                <div className="flex-1">
                  <div className="text-yellow-500 font-semibold flex items-center gap-2">
                    Horarios de atención <EstadoTienda />
                  </div>
                  <div className="mt-2 rounded-xl border border-zinc-200 dark:border-zinc-800">
                    <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                      <div className="p-4">
                        <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                          Lunes a Viernes
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md border border-zinc-200 dark:border-zinc-800 text-sm">
                            8:00 a.m. – 1:00 p.m.
                          </span>
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md border border-zinc-200 dark:border-zinc-800 text-sm">
                            2:00 p.m. – 5:00 p.m.
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                          Sábado
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md border border-zinc-200 dark:border-zinc-800 text-sm">
                            9:00 a.m. – 1:00 p.m.
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                          Domingo
                        </div>
                        <div className="mt-2">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md border border-red-300 text-red-600 bg-red-50 dark:border-red-700 dark:text-red-300 dark:bg-red-950 text-sm">
                            Cerrado
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
