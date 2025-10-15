// src/hooks/useProducts.ts
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/api/products.api";
import type { Product } from "@/types/products";

export function useProducts() {
  const {
    data: products = [],
    isLoading: loading,
    isFetching,
    error,
  } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: getProducts,
    staleTime: 1000 * 60 * 5, // 🧠 Cache por 5 minutos
    refetchOnWindowFocus: false, // 🪟 No recargar al cambiar de pestaña
  });

  return {
    products,
    loading: loading || isFetching,
    error, // ✅ ahora lo devuelve correctamente
  };
}
