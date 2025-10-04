import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // ✅ Permite usar "@/..." en imports
    },
  },
  build: {
    sourcemap: false, // ❌ No genera mapas en prod (mejor rendimiento)
    chunkSizeWarningLimit: 1000, // ⚠️ Aumenta el límite del warning a 1 MB
    rollupOptions: {
      output: {
        // ✅ Divide el código en chunks para mejorar velocidad de carga
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          radix: [
            "@radix-ui/react-aspect-ratio",
            "@radix-ui/react-checkbox",
            "@radix-ui/react-dialog",
            "@radix-ui/react-select",
            "@radix-ui/react-switch",
            "@radix-ui/react-tooltip",
            "@radix-ui/themes",
          ],
          charts: ["recharts"],
          state: ["zustand"],
          utils: ["zod"],
        },
      },
    },
  },
  server: {
    port: 5173, // ⚙️ Puedes cambiarlo si necesitas un puerto específico
    open: true, // 🚀 Abre el navegador automáticamente al iniciar dev
  },
});
