import { useQuery } from "@tanstack/react-query";
import { get } from "@/api/base";

export interface Categoria {
  id: number;
  nombre: string;
}

export function useCategorias() {
  return useQuery<Categoria[]>({
    queryKey: ["categorias"],
    queryFn: () => get<Categoria[]>(`/config/categorias`),
    staleTime: 10 * 60 * 1000,
  });
}

