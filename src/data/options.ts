// src/data/options.ts

// Lista de categorías disponibles
export const categorias = [
  "General",
  "Soldadoras",
  "Caretas",
  "Guantes",
  "Consumibles",
];

// Lista de etiquetas disponibles
export const etiquetas: Array<"Nuevo" | "Oferta" | "Dañado"> = [
  "Nuevo",
  "Oferta",
  "Dañado",
];

// Colores por etiqueta (puedes personalizar al estilo de tu marca)
export const etiquetaColors: Record<(typeof etiquetas)[number], string> = {
  Nuevo: "bg-green-500 text-white",
  Oferta: "bg-yellow-500 text-black",
  Dañado: "bg-red-500 text-white",
};
