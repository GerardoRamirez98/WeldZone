import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { API_URL } from "@/api/base";

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
      const doFetch = async (): Promise<Response> => {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

        const isFormData =
          typeof FormData !== "undefined" && options?.body instanceof FormData;

        const headersInit: HeadersInit = {
          ...(options?.headers || {}),
        };

        if (token && !("Authorization" in (headersInit as Record<string, unknown>))) {
          (headersInit as Record<string, string>)["Authorization"] = `Bearer ${token}`;
        }

        if (!isFormData && !("Content-Type" in (headersInit as Record<string, unknown>))) {
          (headersInit as Record<string, string>)["Content-Type"] = "application/json";
        }

        const isAbsolute = /^https?:\/\//i.test(url);
        const isAlreadyApi = url.startsWith(API_URL) || url.startsWith("/api/");
        const finalUrl = isAbsolute ? url : isAlreadyApi ? url : `${API_URL}${url}`;
        return fetch(finalUrl, {
          credentials: "include",
          ...options,
          headers: headersInit,
        });
      };

      let response = await doFetch();
      if (response.status === 401) {
        const refreshed = await tryRefresh();
        if (refreshed) {
          response = await doFetch();
        }
      }

            // Si el servidor responde con un error, lo manejamos
      if (!response.ok) {
        let serverMessage = "";
        try {
          const ct = response.headers.get("Content-Type") || "";
          if (ct.includes("application/json")) {
            const body = await response.clone().json();
            serverMessage =
              (typeof body?.message === "string" && body.message) ||
              (Array.isArray(body?.message) ? body.message.join("\n") : "");
          } else {
            serverMessage = await response.clone().text();
          }
        } catch {}

        switch (response.status) {
          case 401:
            toast.warning("Tu sesión ha expirado. Inicia sesión nuevamente.");
            navigate("/login");
            break;
          case 403:
            toast.error("No tienes permiso para acceder a esta sección.");
            navigate("/acceso-denegado");
            break;
          case 409:
          case 400:
            toast.warning(serverMessage || "Solicitud inválida.");
            break;
          case 500:
            console.error("🔥 Error interno del servidor");
            navigate("/error-500");
            break;
          default:
            toast.error(serverMessage || `Ocurrió un error (${response.status}). Intenta de nuevo.`);
        }
        throw new Error(serverMessage || `HTTP error ${response.status}`);
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

let refreshPromise: Promise<string | null> | null = null;
async function tryRefresh(): Promise<boolean> {
  const start = () =>
    fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    })
      .then(async (r) => {
        if (!r.ok) return null;
        const data = (await r.json()) as { access_token?: string };
        const token = data?.access_token ?? null;
        if (token) localStorage.setItem("token", token);
        return token;
      })
      .catch(() => null);

  if (!refreshPromise) refreshPromise = start();
  const token = await refreshPromise.finally(() => (refreshPromise = null));
  if (!token) {
    // Si no se pudo refrescar, limpiar y redirigir
    localStorage.removeItem("token");
    return false;
  }
  return true;
}

