// src/lib/api.ts
import { z } from "zod";

export const ProductoSchema = z.object({
  id: z.number(),
  nombre: z.string(),
  descripcion: z.string(),
  precio: z.number(),
  categoria: z.string(),
  etiqueta: z.enum(["Nuevo", "Oferta", "Dañado"]).optional(),
  imagenUrl: z.string().url().optional(),
});

export type ProductoDTO = z.infer<typeof ProductoSchema>;

export async function fetchJSON<T>(
  url: string,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<T>;
}
