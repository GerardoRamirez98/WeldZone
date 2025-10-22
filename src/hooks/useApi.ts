import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

/**
 * Hook para centralizar peticiones HTTP y manejo de errores globales
 */
export function useApi() {
  const navigate = useNavigate();

  /**
   * Realiza una solicitud HTTP con manejo automático de errores
   * @param url - Endpoint relativo o absoluto
   * @param options - Opciones de `fetch` estándar
   */
  const request = async (url: string, options?: RequestInit) => {
    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...(options?.headers || {}),
        },
        ...options,
      });

      // Si el servidor responde con un error, lo manejamos
      if (!response.ok) {
        switch (response.status) {
          case 401:
            toast.warning("Tu sesión ha expirado. Inicia sesión nuevamente.");
            navigate("/login");
            break;

          case 403:
            toast.error("No tienes permiso para acceder a esta sección.");
            break;

          case 500:
            console.error("🔥 Error interno del servidor");
            navigate("/error-500");
            break;

          default:
            toast.error(
              `Ocurrió un error (${response.status}). Intenta de nuevo.`
            );
        }

        throw new Error(`HTTP error ${response.status}`);
      }

      // Si la respuesta tiene contenido, la parseamos
      const contentType = response.headers.get("Content-Type");
      if (contentType?.includes("application/json")) {
        return await response.json();
      }
      return response.text();
    } catch (error) {
      console.error("💥 Error en useApi:", error);
      // Si el error no viene del servidor, podrías mostrar algo genérico
      toast.error("Error de conexión. Verifica tu red.");
      throw error;
    }
  };

  return { request };
}
