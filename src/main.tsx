import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthProvider"; // ✅ IMPORTANTE

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        {" "}
        {/* ✅ ENVUELVE TODA LA APP */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
