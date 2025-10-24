import { useState, useEffect, lazy, Suspense } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import Catalogo from "./pages/Catalogo";
import Nosotros from "./pages/Nosotros";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

const AdminLayout = lazy(() => import("./admin/AdminLayout"));
const Dashboard = lazy(() => import("./admin/pages/Dashboard"));
const Products = lazy(() => import("./admin/pages/Products"));
const AdminConfig = lazy(() => import("./admin/pages/AdminConfig"));

import Footer from "./components/Footer";
import Loader from "./components/Loader";
import { useMaintenance } from "./hooks/useMaintenance";

// ⚠️ Importa tus páginas de error
import Error404 from "./pages/errors/Error404";
import Error503 from "./pages/errors/Error503";
import Error500 from "./pages/errors/Error500";

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = location.pathname.startsWith("/admin");
  const isCatalogo = location.pathname === "/";
  const isLogin = location.pathname === "/login";

  const [showFooter, setShowFooter] = useState(false);
  const [pageChange, setPageChange] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  // Modo mantenimiento vía React Query
  const { mantenimiento: maintenanceMode } = useMaintenance();

  // 🧩 Control de modo mantenimiento (puede venir de Supabase o variable de entorno)


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
      {!isAdmin && !isLogin && (
        <Header
          onSearch={(q: string) => {
            const params = new URLSearchParams(location.search);
            const value = q.trim();
            if (value) params.set("q", value);
            else params.delete("q");

            // Navega al catálogo y sincroniza el query param
            if (location.pathname !== "/") {
              navigate(
                {
                  pathname: "/",
                  search: params.toString() ? `?${params.toString()}` : "",
                },
                { replace: false }
              );
            } else {
              navigate(
                {
                  search: params.toString() ? `?${params.toString()}` : "",
                },
                { replace: true }
              );
            }
          }}
        />
      )}

      {/* 📦 Rutas */}
      <main className="flex-1">
        <Routes>
          {/* 🛠️ Página de mantenimiento */}
          {maintenanceMode && !isAdmin ? (
            <Route path="*" element={<Error503 />} />
          ) : (
            <>
              {/* 🌐 Rutas públicas */}
              <Route path="/" element={<Catalogo />} />
              <Route path="/nosotros" element={<Nosotros />} />
              <Route path="/login" element={<Login />} />

              {/* 🛠️ Panel Admin protegido */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<div className="p-6">Cargando panel...</div>}>
                      <AdminLayout />
                    </Suspense>
                  </ProtectedRoute>
                }
              >
                <Route
                  index
                  element={
                    <Suspense fallback={<div className="p-6">Cargando...</div>}>
                      <Dashboard />
                    </Suspense>
                  }
                />
                <Route
                  path="products"
                  element={
                    <Suspense fallback={<div className="p-6">Cargando...</div>}>
                      <Products />
                    </Suspense>
                  }
                />
                <Route
                  path="config"
                  element={
                    <Suspense fallback={<div className="p-6">Cargando...</div>}>
                      <AdminConfig />
                    </Suspense>
                  }
                />
              </Route>

              <Route path="/error-500" element={<Error500 />} />
              <Route path="*" element={<Error404 />} />
            </>
          )}
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
