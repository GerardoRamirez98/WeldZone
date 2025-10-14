import { useEffect, useState } from "react";

export interface Config {
  whatsapp: string;
}

export function useConfig() {
  const [config, setConfig] = useState<Config | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        // ✅ 1. Cargar desde localStorage (si existe)
        const cached = localStorage.getItem("weldzone_config");
        let cachedConfig: Config | null = null;
        if (cached) {
          cachedConfig = JSON.parse(cached);
          setConfig(cachedConfig);
          setLoading(false);
        }

        // ✅ 2. Pedir la versión actual al backend
        const res = await fetch(`${API_URL}/config`);
        if (!res.ok) throw new Error("Error al obtener configuración");
        const data: Config = await res.json();

        // ✅ 3. Si el número cambió en el backend, actualizar cache y estado
        if (!cachedConfig || cachedConfig.whatsapp !== data.whatsapp) {
          localStorage.setItem("weldzone_config", JSON.stringify(data));
          setConfig(data);
        }
      } catch (err) {
        console.error("❌ Error al cargar configuración:", err);
        setError("No se pudo cargar la configuración del sistema");
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();

    // 🕒 4. Revalidar cada 10 minutos (por si cambia en segundo plano)
    const interval = setInterval(fetchConfig, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, [API_URL]);

  return { config, loading, error };
}
