// src/api/products.api.ts
import type { Product } from "@/types/products";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${API_URL}/products`);
  if (!res.ok) throw new Error("Error al cargar productos");
  return res.json();
}
