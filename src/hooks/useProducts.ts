// src/hooks/useProducts.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useProductsApi } from "@/api/products.api";
import type { Product, NewProduct } from "@/types/products";

/**
 * Hook para obtener la lista de productos con cache y manejo automático
 * de errores y recarga usando React Query.
 */
export function useProducts() {
  const { getProducts } = useProductsApi();

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
    error,
  };
}

/**
 * Hook para crear productos
 */
export function useCreateProduct() {
  const { createProduct } = useProductsApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newProduct: NewProduct) => createProduct(newProduct),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

/**
 * Hook para actualizar productos
 */
export function useUpdateProduct() {
  const { updateProduct } = useProductsApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Product> }) =>
      updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

/**
 * Hook para eliminar productos
 */
export function useDeleteProduct() {
  const { deleteProduct } = useProductsApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
