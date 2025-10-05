import type { Product } from "../types/products";

const API_URL = import.meta.env.VITE_API_URL;

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${API_URL}/products`);
  if (!res.ok) throw new Error("Error al cargar productos");
  return res.json();
}

export async function createProduct(
  data: Omit<Product, "id">
): Promise<Product> {
  const res = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear producto");
  return res.json();
}

export async function updateProduct(
  id: number,
  data: Partial<Product>
): Promise<Product> {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al actualizar producto");
  return res.json();
}

export async function deleteProduct(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/products/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar producto");
}
