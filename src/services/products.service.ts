import { getProducts } from "@/api/products.api";

export async function fetchAllProducts() {
  const products = await getProducts();
  return products.filter((p) => p.stock > 0); // ejemplo: solo productos con stock
}
