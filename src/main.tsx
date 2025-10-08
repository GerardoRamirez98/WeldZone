import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthProvider";
import { Toaster } from "sonner"; // ✅ Importamos el Toaster global

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        {/* ✅ Agregamos Toaster para notificaciones globales */}
        <Toaster
          richColors
          theme="system" // adapta automáticamente modo claro/oscuro
          position="bottom-right" // esquina inferior derecha
          expand={false} // muestra uno a la vez (opcional)
        />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
