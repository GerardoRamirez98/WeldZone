import { MapPin, Mail, Phone } from "lucide-react";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";
import welderImg from "../assets/welder.png"; // 👈 tu imagen aquí

export default function Footer() {
  return (
    <footer className="bg-zinc-950 text-zinc-300 border-t-4 border-yellow-500">
      <div className="container mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 items-start">
        {/* 🧱 Columna 1 - Imagen destacada */}
        <div className="flex items-center justify-center lg:justify-start">
          <div className="relative w-40 h-40 flex items-center justify-center">
            {/* 🔵 Círculo amarillo detrás */}
            <div className="absolute inset-0 bg-yellow-500 rounded-full scale-110 blur-[2px] opacity-90" />

            {/* 🧰 Imagen de soldador */}
            <img
              src={welderImg}
              alt="Soldador profesional"
              className="relative z-10 w-32 h-32 object-contain drop-shadow-xl"
            />
          </div>
        </div>

        {/* 🧱 Columna 2 - Branding */}
        <div>
          <h2 className="text-yellow-500 text-2xl font-bold mb-4">WeldZone</h2>
          <p className="text-sm leading-relaxed text-zinc-400 max-w-xs">
            Potencia y calidad para el soldador profesional. Equipos,
            consumibles y protección diseñados para durar.
          </p>
        </div>

        {/* 📲 Columna 3 - Redes sociales */}
        <div>
          <h3 className="text-yellow-500 font-semibold mb-4">Síguenos</h3>
          <div className="flex space-x-4 text-2xl">
            <a
              href="https://www.facebook.com/profile.php?id=61579354317811"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-yellow-500 transition-colors"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://www.instagram.com/weldzone.mx/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-yellow-500 transition-colors"
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

        {/* 📬 Columna 4 - Contacto */}
        <div>
          <h3 className="text-yellow-500 font-semibold mb-4">Contáctanos</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4" /> 474 117 8597
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4" /> weldzonealtos@gmail.com
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-1" /> Margarito González Rubio
              #1195C
              <br /> El Refugio, Lagos de Moreno, Jalisco
            </li>
          </ul>
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
