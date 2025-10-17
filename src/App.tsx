import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Catalogo from "./pages/Catalogo";
import Nosotros from "./pages/Nosotros";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

// Admin imports
import AdminLayout from "./admin/AdminLayout";
import Dashboard from "./admin/pages/Dashboard";
import Products from "./admin/pages/Products";
import AdminConfig from "./admin/pages/AdminConfig";

import Footer from "./components/Footer";
import Loader from "./components/Loader";

export default function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const isCatalogo = location.pathname === "/";
  const isLogin = location.pathname === "/login"; // ✅ Detectamos si estamos en login

  const [showFooter, setShowFooter] = useState(false);
  const [pageChange, setPageChange] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false); // 👈 Nuevo flag

  // 📍 Detectar scroll solo en catálogo
  useEffect(() => {
    if (!isCatalogo) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;
      const nearBottom = scrollTop + clientHeight >= scrollHeight - 100;
      setShowFooter(nearBottom);
    };

    const { scrollHeight, clientHeight } = document.documentElement;
    if (scrollHeight <= clientHeight + 50) {
      setShowFooter(true);
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isCatalogo]);

  // ⏱️ Loader global (solo en la primera carga)
  useEffect(() => {
    if (isAdmin) {
      setShowLoader(false);
      return;
    }

    // Mostrar loader solo una vez al entrar por primera vez
    if (!hasLoaded) {
      setShowLoader(true);
      const timeout = setTimeout(() => {
        setShowLoader(false);
        setHasLoaded(true);
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [isAdmin, hasLoaded]);

  // 🧭 Animación footer
  useEffect(() => {
    if (!isCatalogo && !isAdmin) {
      setPageChange(true);
      const timeout = setTimeout(() => setPageChange(false), 800);
      return () => clearTimeout(timeout);
    }
  }, [isCatalogo, isAdmin]);

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      {/* 🔄 Loader global visible solo la primera vez con fade-out */}
      <div
        className={`fixed inset-x-0 top-[4rem] bottom-0 z-50 transition-opacity duration-700 ease-out
        ${
          showLoader
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <Loader />
      </div>

      {/* 🧠 Header solo en páginas públicas (NO en login ni admin) */}
      {!isAdmin && !isLogin && <Header onSearch={() => {}} />}

      {/* 📦 Rutas */}
      <main className="flex-1">
        <Routes>
          {/* 🌐 Rutas públicas */}
          <Route path="/" element={<Catalogo />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/login" element={<Login />} />

          {/* 🛠️ Panel Admin protegido */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="config" element={<AdminConfig />} />
          </Route>
        </Routes>
      </main>

      {/* 📦 Footer solo en páginas públicas (NO en login ni admin) */}
      {!isAdmin && !isLogin && (
        <div
          className={`transition-all duration-700 ease-out transform ${
            isCatalogo
              ? showFooter
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10 pointer-events-none"
              : pageChange
              ? "opacity-100 translate-y-0"
              : "opacity-100 translate-y-0"
          }`}
        >
          <Footer />
        </div>
      )}
    </div>
  );
}
