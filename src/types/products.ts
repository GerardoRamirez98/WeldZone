// src/types/products.ts

export interface Product {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;

  // 🔹 Relaciones dinámicas (según tu modelo Prisma)
  categoriaId?: number | null; // FK hacia Categoria
  categoria?: {
    id: number;
    nombre: string;
  } | null;

  etiquetaId?: number | null; // FK hacia Etiqueta
  etiqueta?: {
    id: number;
    nombre: string;
    color: string;
  } | null;

  imagenUrl?: string;
  specFileUrl?: string | null;
  estado?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ✅ Tipo para crear nuevos productos (sin ID obligatorio)
export type NewProduct = Omit<Product, "id">;
