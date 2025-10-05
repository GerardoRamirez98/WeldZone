export interface Product {
  id?: number; // ✅ opcional si lo genera el backend
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria: string;
  etiqueta?: "Nuevo" | "Oferta" | "Descontinuado";
  imagenUrl?: string; // ✅ este es el nombre correcto que usas en el frontend
  estado?: string; // ✅ si tu backend lo usa
}
