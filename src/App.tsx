import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Catalogo from "./pages/Catalogo";
import About from "./pages/About";

export default function App() {
  return (
    <div className="min-h-dvh bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      {/* Header fijo en todas las páginas */}
      <Header onSearch={() => {}} />

      {/* Rutas */}
      <Routes>
        <Route path="/" element={<Catalogo />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  );
}
