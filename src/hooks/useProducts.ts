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
 * Hook para productos inactivos (eliminados lógicamente)
 */
export function useInactiveProducts() {
  const { getProductsIncludeInactive } = useProductsApi();
  const {
    data: products = [],
    isLoading: loading,
    isFetching,
    error,
  } = useQuery<Product[]>({
    queryKey: ["products-inactive"],
    queryFn: getProductsIncludeInactive,
    staleTime: 0, // siempre considerado stale para refetch inmediato
    refetchOnWindowFocus: false,
    refetchOnMount: "always", // al entrar a la vista, fuerza refetch
    select: (all) => all.filter((p) => p.estado === "inactivo" || p.activo === false),
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
      queryClient.invalidateQueries({ queryKey: ["products-inactive"] });
    },
  });
}

/**
 * Hook para restaurar productos (reactivar)
 */
export function useRestoreProduct() {
  const { restoreProduct } = useProductsApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => restoreProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["products-inactive"] });
    },
  });
}

/**
 * Hook para eliminación definitiva
 */
export function useForceDeleteProduct() {
  const { forceDeleteProduct } = useProductsApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, password }: { id: number; password: string }) =>
      forceDeleteProduct(id, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["products-inactive"] });
    },
  });
}
