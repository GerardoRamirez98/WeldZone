export interface Product {
  id: number; // ID único del producto
  nombre: string; // Nombre del producto
  descripcion: string; // Descripción del producto
  precio: number; // Precio en USD
  stock: number; // Cantidad en stock
  categoria: string; // Categoría del producto
  etiqueta?: "Nuevo" | "Oferta" | "Descontinuado"; // Etiqueta opcional
  imagenUrl?: string; // URL de la imagen (opcional)
  specFileUrl?: string | null; // URL del archivo de especificaciones (opcional)
  estado?: string; // Estado del producto (opcional)
  createdAt?: string; // Fecha de creación (opcional)
  updatedAt?: string; // Fecha de última actualización (opcional)
}

// ✅ Tipo especial para crear nuevos productos (sin id)
export type NewProduct = Omit<Product, "id">;
