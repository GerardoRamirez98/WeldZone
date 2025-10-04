// src/api/products.ts
import type { Product } from "../types/products";

const API_URL = "http://localhost:3000/products";

// GET todos los productos
export async function getProducts(): Promise<Product[]> {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Error al obtener productos");
  return res.json();
}
