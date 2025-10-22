import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface Props {
  code: number;
  title: string;
  message: string;
  children?: ReactNode;
  /** Texto opcional para el botón principal */
  actionLabel?: string;
  /** Acción personalizada (si no se define, redirige al inicio) */
  onAction?: () => void;
}

export default function ErrorLayout({
  code,
  title,
  message,
  children,
  actionLabel = "Volver al inicio",
  onAction,
}: Props) {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-neutral-950 text-white overflow-hidden px-4 animate-fade-in">
      {/* 🌌 Fondo animado (sin bloquear clics) */}
      <div className="absolute inset-0 -z-10 pointer-events-none bg-gradient-to-t from-yellow-600/10 to-transparent animate-pulse-soft" />

      {/* 🧱 Código del error */}
      <h1 className="text-7xl font-extrabold text-yellow-400 mb-3 drop-shadow-[0_0_10px_rgba(255,230,0,0.8)] glow-weld">
        {code}
      </h1>

      {/* 🧠 Título y mensaje */}
      <h2 className="text-3xl font-semibold mb-4">{title}</h2>
      <p className="text-gray-400 text-center max-w-md">{message}</p>

      {/* 🎨 Contenido extra opcional */}
      {children}

      {/* 🔘 Botón principal */}
      {onAction ? (
        <button
          onClick={onAction}
          className="mt-8 bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2 px-6 rounded-xl transition-transform hover:scale-105 shadow-[0_0_10px_rgba(255,230,0,0.5)]"
        >
          {actionLabel}
        </button>
      ) : (
        <Link
          to="/"
          className="mt-8 bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2 px-6 rounded-xl transition-transform hover:scale-105 shadow-[0_0_10px_rgba(255,230,0,0.5)] inline-block"
        >
          {actionLabel}
        </Link>
      )}

      {/* ✨ Efecto chispa inferior */}
      <div className="absolute bottom-8 right-8 w-2 h-2 bg-yellow-400 rounded-full animate-spark pointer-events-none" />
    </div>
  );
}
