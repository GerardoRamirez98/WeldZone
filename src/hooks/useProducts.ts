// src/hooks/useProducts.ts
import { useEffect, useState } from "react";
import { getProducts } from "@/api/products.api";
import type { Product } from "@/types/products";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { products, loading };
}
