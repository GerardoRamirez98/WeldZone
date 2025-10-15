import { get, post, put, del } from "./client";

export type Product = {
  id: number;
  nombre: string;
  descripcion?: string | null;
  precio: number;
  categoria?: string | null;
  etiqueta?: string | null;
  imagenUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateProductDto = Omit<Product, "id" | "createdAt" | "updatedAt">;
export type UpdateProductDto = Partial<CreateProductDto>;

export const ProductsAPI = {
  list: () => get<Product[]>("/products"),
  getById: (id: number) => get<Product>(`/products/${id}`),
  create: (data: CreateProductDto) => post<Product>("/products", data),
  update: (id: number, data: UpdateProductDto) =>
    put<Product>(`/products/${id}`, data),
  remove: (id: number) => del<{ message?: string }>(`/products/${id}`),
};
