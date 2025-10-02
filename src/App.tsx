import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Catalogo from "./pages/Catalogo";
import About from "./pages/About";

// Admin imports
import AdminLayout from "./admin/AdminLayout";
import Dashboard from "./admin/pages/Dashboard";
import Products from "./admin/pages/Products";

export default function App() {
  return (
    <div className="min-h-dvh bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <Routes>
        {/* Sitio público con Header fijo */}
        <Route
          path="/"
          element={
            <>
              <Header onSearch={() => {}} />
              <Catalogo />
            </>
          }
        />
        <Route
          path="/about"
          element={
            <>
              <Header onSearch={() => {}} />
              <About />
            </>
          }
        />

        {/* Rutas Admin con layout propio */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
        </Route>
      </Routes>
    </div>
  );
}
