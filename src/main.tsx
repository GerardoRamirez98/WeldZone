import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthProvider";
import { CartProvider } from "./context/CartContext";
import { Toaster } from "sonner";
import ErrorBoundary from "./components/ErrorBoundary";

// ⚡ Instancia del cliente de React Query
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        {/* 🧱 Aquí envolvemos la app entera en el ErrorBoundary */}
        <ErrorBoundary>
          <AuthProvider>
            <CartProvider>
              <App />
              <Toaster
                richColors
                theme="system"
                position="bottom-right"
                expand={false}
              />
            </CartProvider>
          </AuthProvider>
        </ErrorBoundary>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
);
