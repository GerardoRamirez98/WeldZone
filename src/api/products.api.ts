import type { Product } from "../types/products";

// ✅ URL base del backend (asegúrate que tu .env tenga VITE_API_URL=http://localhost:3000)
const API_URL = import.meta.env.VITE_API_URL;

// 📥 Obtener todos los productos
export async function getProducts(): Promise<Product[]> {
  console.log("📡 Solicitando productos desde:", `${API_URL}/products`);
  const res = await fetch(`${API_URL}/products`);
  if (!res.ok) throw new Error("Error al obtener productos");
  return res.json();
}

// 📤 Crear un nuevo producto
export async function createProduct(product: Product) {
  const res = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });

  if (!res.ok) throw new Error("Error al crear producto");
  return await res.json();
}

// ✏️ Actualizar un producto
export async function updateProduct(
  id: number,
  product: Partial<Product>
): Promise<Product> {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });

  if (!res.ok) throw new Error("Error al actualizar producto");
  return res.json();
}

// 🗑️ Eliminar un producto
export async function deleteProduct(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/products/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar producto");
}
