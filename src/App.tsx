import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Catalogo from "./pages/Catalogo";
import About from "./pages/About";

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

  const [showFooter, setShowFooter] = useState(false);
  const [pageChange, setPageChange] = useState(false);
  const [showLoader, setShowLoader] = useState(true);

  // 📍 Detectar scroll solo en catálogo
  useEffect(() => {
    if (!isCatalogo) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;
      const scrolledToBottom = scrollTop + clientHeight >= scrollHeight - 50;
      setShowFooter(scrolledToBottom);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isCatalogo]);

  // ⏱️ Mostrar loader en cada cambio de ruta
  useEffect(() => {
    setShowLoader(true);
    const timeout = setTimeout(() => setShowLoader(false), 2000); // ⏱️ 2s
    return () => clearTimeout(timeout);
  }, [location.pathname]);

  // 🧭 Detectar cambio de página y activar animación del footer
  useEffect(() => {
    if (!isCatalogo && !isAdmin) {
      setPageChange(true);
      const timeout = setTimeout(() => setPageChange(false), 800);
      return () => clearTimeout(timeout);
    }
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      {/* 🔄 Loader global debajo del header */}
      {showLoader && (
        <div className="fixed inset-x-0 top-[4rem] bottom-0 z-50">
          <Loader />
        </div>
      )}

      {/* 🧠 Header solo en la parte pública */}
      {!isAdmin && <Header onSearch={() => {}} />}

      {/* 📦 Contenido principal */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Catalogo />} />
          <Route path="/about" element={<About />} />

          {/* 🛠️ Panel Admin */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="config" element={<AdminConfig />} />
          </Route>
        </Routes>
      </main>

      {/* 📦 Footer animado */}
      {!isAdmin && (
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
