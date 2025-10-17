import { MapPin, Mail, Phone, Clock } from "lucide-react";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";
import welderImg from "../assets/welder.png";

export default function Footer() {
  return (
    <footer className="bg-zinc-950 text-zinc-300 border-t border-yellow-600/60 shadow-[0_-2px_15px_rgba(255,193,7,0.1)]">
      <div className="container mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 items-start">
        {/* 🧰 Logo / Branding */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
          <div className="relative w-32 h-32 mb-3">
            <div className="absolute inset-0 bg-yellow-500 rounded-full blur-[2px] opacity-90" />
            <img
              src={welderImg}
              alt="Soldador profesional"
              className="relative z-10 w-28 h-28 object-contain mx-auto"
            />
          </div>
          <h2 className="text-yellow-500 text-xl font-bold mb-2">WeldZone</h2>
          <p className="text-sm text-zinc-400 leading-relaxed max-w-xs">
            Potencia y calidad para el soldador profesional. Equipos,
            consumibles y protección diseñados para durar.
          </p>
        </div>

        {/* 🕒 Horarios */}
        <div>
          <h3 className="text-yellow-400 font-semibold mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-yellow-500" /> Horarios de atención
          </h3>

          <ul className="text-sm text-zinc-400 space-y-2">
            <li>
              <strong className="text-zinc-200 block">Lunes a Viernes:</strong>
              <div className="grid gap-x-4 pl-1">
                <span>8:00 a.m. – 1:00 p.m.</span>
                <span>2:00 p.m. – 5:00 p.m.</span>
              </div>
            </li>
            <li>
              <strong className="text-zinc-200 block">Sábado:</strong>
              <div className="pl-1">9:00 a.m. – 1:00 p.m.</div>
            </li>
            <li>
              <strong className="text-zinc-200 block">Domingo:</strong>
              <div className="pl-1">Cerrado</div>
            </li>
          </ul>
        </div>

        {/* 📞 Contacto */}
        <div>
          <h3 className="text-yellow-400 font-semibold mb-3">Contáctanos</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-yellow-500" /> 474 117 8597
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-yellow-500" />{" "}
              weldzonealtos@gmail.com
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-1 text-yellow-500" />
              Margarito González Rubio #1195C
              <br />
              El Refugio, Lagos de Moreno, Jalisco
            </li>
          </ul>
        </div>

        {/* 🌐 Redes sociales */}
        <div>
          <h3 className="text-yellow-400 font-semibold mb-3">Síguenos</h3>
          <div className="flex space-x-4 text-xl">
            <a
              href="https://www.facebook.com/profile.php?id=61579354317811"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-yellow-400 transition-colors"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://www.instagram.com/weldzone.mx/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-yellow-400 transition-colors"
            >
              <FaInstagram />
            </a>
            <a
              href="https://wa.me/524741129867"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-green-500 transition-colors"
            >
              <FaWhatsapp />
            </a>
          </div>
        </div>
      </div>

      {/* 📍 Línea inferior */}
      <div className="border-t border-zinc-800 py-4 text-center text-xs text-zinc-500">
        © {new Date().getFullYear()}{" "}
        <span className="text-yellow-500 font-semibold">WeldZone</span> —
        Potencia para el soldador ⚡
      </div>
    </footer>
  );
}
