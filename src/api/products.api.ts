import { useApi } from "../hooks/useApi";
import type { Product, NewProduct } from "../types/products";

// ✅ URL base del backend (puede ser local o de producción)
import { API_URL } from "./base";

/**
 * Hook API para manejar productos con control de errores global
 * a través de useApi().
 */
export function useProductsApi() {
  const { request } = useApi();

  // 📥 Obtener todos los productos
  const getProducts = async (): Promise<Product[]> => {
    return await request(`${API_URL}/products`);
  };

  // 📤 Crear un nuevo producto
  const createProduct = async (product: NewProduct): Promise<Product> => {
    return await request(`${API_URL}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
  };

  // ✏️ Actualizar un producto
  const updateProduct = async (
    id: number,
    product: Partial<Product>
  ): Promise<Product> => {
    return await request(`${API_URL}/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
  };

  // 🗑️ Eliminar un producto
  const deleteProduct = async (id: number): Promise<void> => {
    await request(`${API_URL}/products/${id}`, {
      method: "DELETE",
    });
  };

  // Reactivar un producto inactivo
  const restoreProduct = async (id: number): Promise<void> => {
    await request(`${API_URL}/products/${id}/restore`, {
      method: "PATCH",
    });
  };

  // Eliminación definitiva de un producto, requiere contraseña
  const forceDeleteProduct = async (
    id: number,
    password: string
  ): Promise<void> => {
    await request(`${API_URL}/products/${id}/force`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
  };

  // Obtener productos incluyendo inactivos (usar para vista "Eliminados")
  const getProductsIncludeInactive = async (): Promise<Product[]> => {
    return await request(`${API_URL}/products?includeInactive=true`);
  };

  // 🖼️ Subir imagen (opcional)
  const uploadProductImage = async (file: File, productId: number) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("productId", String(productId));

    return await request(`${API_URL}/products/upload`, {
      method: "POST",
      body: formData,
      headers: {}, // ⚠️ No definas Content-Type, el navegador lo hace
    });
  };

  return {
    getProducts,
    getProductsIncludeInactive,
    createProduct,
    updateProduct,
    deleteProduct,
    restoreProduct,
    forceDeleteProduct,
    uploadProductImage, // opcional
  };
}

