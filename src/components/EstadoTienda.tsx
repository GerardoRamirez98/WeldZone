import { useEffect, useState } from "react";

export default function EstadoTienda() {
  const [estado, setEstado] = useState("Cargando...");

  const verificarHorario = () => {
    const ahora = new Date();
    const dia = ahora.getDay();
    const hora = ahora.getHours();
    const minutos = ahora.getMinutes();
    const totalMinutos = hora * 60 + minutos;

    let abierto = false;
    let cierraPronto = false;

    if (dia >= 1 && dia <= 5) {
      if (
        (totalMinutos >= 8 * 60 && totalMinutos < 13 * 60) ||
        (totalMinutos >= 14 * 60 && totalMinutos < 17 * 60)
      ) {
        abierto = true;
        if (
          (totalMinutos >= 12.5 * 60 && totalMinutos < 13 * 60) ||
          (totalMinutos >= 16.5 * 60 && totalMinutos < 17 * 60)
        ) {
          cierraPronto = true;
        }
      }
    } else if (dia === 6) {
      if (totalMinutos >= 9 * 60 && totalMinutos < 13 * 60) {
        abierto = true;
        if (totalMinutos >= 12.5 * 60 && totalMinutos < 13 * 60) {
          cierraPronto = true;
        }
      }
    }

    if (abierto && cierraPronto) setEstado("🟠 Cierra pronto");
    else if (abierto) setEstado("🟢 Abierto ahora");
    else setEstado("🔴 Cerrado");
  };

  useEffect(() => {
    verificarHorario();
    const intervalo = setInterval(verificarHorario, 60000);
    return () => clearInterval(intervalo);
  }, []);

  return (
    <span
      className={`text-xs font-semibold tracking-wide ${
        estado.includes("Abierto")
          ? "text-green-500"
          : estado.includes("Cierra")
          ? "text-yellow-400"
          : "text-red-500"
      }`}
    >
      {estado}
    </span>
  );
}
