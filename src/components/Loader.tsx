import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";

const frases = [
  "Preparando el arco",
  "Fundiendo acero",
  "Soldando componentes",
  "Forjando potencia",
];

export default function Loader() {
  const [fraseIndex, setFraseIndex] = useState(0);
  const [dots, setDots] = useState(".");

  // 🔄 Rotar frases cada 800ms
  useEffect(() => {
    const fraseTimer = setInterval(() => {
      setFraseIndex((prev) => (prev + 1) % frases.length);
    }, 800);
    return () => clearInterval(fraseTimer);
  }, []);

  // ⚙️ Animación de puntos (...)
  useEffect(() => {
    const dotTimer = setInterval(() => {
      setDots((prev) => (prev.length === 3 ? "." : prev + "."));
    }, 500);
    return () => clearInterval(dotTimer);
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center backdrop-blur-md bg-zinc-50/80 dark:bg-zinc-950/80 transition-colors">
      {/* 🛠️ Spinner con icono */}
      <div className="relative flex items-center justify-center mb-6">
        <div className="animate-spin rounded-full h-20 w-20 border-4 border-yellow-500 border-t-transparent"></div>
        <Sparkles
          className="absolute text-yellow-500 animate-pulse"
          size={36}
        />
      </div>

      {/* 🧰 Texto dinámico */}
      <p className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 tracking-wide text-center">
        {frases[fraseIndex]}
        <span className="inline-block w-4">{dots}</span>
      </p>

      {/* 🪛 Subtexto opcional */}
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
        Cargando sistema de soldadura...
      </p>
    </div>
  );
}
