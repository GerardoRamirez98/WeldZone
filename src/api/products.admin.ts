import type { Product } from "../types/products";
import { get, post, put, del } from "./base";

export async function fetchProducts(): Promise<Product[]> {
  return get<Product[]>(`/products`);
}

export async function createProduct(
  data: Omit<Product, "id">
): Promise<Product> {
  return post<Product>(`/products`, data);
}

export async function updateProduct(
  id: number,
  data: Partial<Product>
): Promise<Product> {
  return put<Product>(`/products/${id}`, data);
}

export async function deleteProduct(id: number): Promise<void> {
  await del<void>(`/products/${id}`);
}
