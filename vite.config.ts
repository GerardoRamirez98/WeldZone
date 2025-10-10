import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
  // Cargar variables .env según el modo
  const env = loadEnv(mode, process.cwd(), "");
  console.log(`🌍 Usando backend: ${env.VITE_API_URL}`);

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      sourcemap: false,
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            react: ["react", "react-dom", "react-router-dom"], // Agrupa React y React DOM en un solo chunk
            radix: [
              "@radix-ui/react-aspect-ratio", // Ejemplo de un componente Radix UI
              "@radix-ui/react-checkbox", // Agrega más componentes según sea necesario
              "@radix-ui/react-dialog", // Agrega más componentes según sea necesario
              "@radix-ui/react-select", // Agrega más componentes según sea necesario
              "@radix-ui/react-switch", // Agrega más componentes según sea necesario
              "@radix-ui/react-tooltip", // Agrega más componentes según sea necesario
              "@radix-ui/themes", // Agrega Radix UI al chunk de Radix
            ],
            charts: ["recharts"], // Agrega Recharts al chunk de gráficos
            state: ["zustand"], // Agrega Zustand al chunk de estado
            utils: ["zod"], // Agrega Zod al chunk de utilidades
          },
        },
      },
    },
    server: {
      port: 5173, // Puerto del servidor
      open: true, // Abrir el navegador automáticamente
    },
  };
});
