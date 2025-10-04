// src/types/product.ts
export interface Product {
  id: number;
  nombre: string;
  descripcion?: string | null;
  precio: number;
  stock: number;
  categoria: string;
  etiqueta?: string | null;
  imagenUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}
