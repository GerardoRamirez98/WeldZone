export interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria: string;
  etiqueta?: "Nuevo" | "Oferta" | "Descontinuado";
  imagenUrl?: string;
  estado?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ✅ Tipo especial para crear nuevos productos (sin id)
export type NewProduct = Omit<Product, "id">;
