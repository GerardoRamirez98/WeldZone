import { useState, useEffect } from "react";
import { Package, TrendingDown, TrendingUp, AlertTriangle } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { motion } from "framer-motion";

// 🧩 Tipo según tu backend
type Producto = {
  id: number;
  nombre: string;
  precio: number;
  categoria?: { nombre: string } | string | null;
  estado?: string;
};

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function Dashboard() {
  const [products, setProducts] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔄 Cargar productos desde backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/products`);
        if (!res.ok) throw new Error("Error al obtener productos");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("❌ Error al cargar productos:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // 📊 Métricas
  const total = products.length;
  const activos = products.filter((p) => p.estado === "activo").length;
  const descontinuados = products.filter(
    (p) => p.estado === "descontinuado"
  ).length;

  // 🧮 Agrupar por categoría
  const categorias = products.reduce((acc: Record<string, number>, p) => {
    const cat =
      typeof p.categoria === "string"
        ? p.categoria
        : p.categoria?.nombre || "Sin categoría";
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(categorias).map(([name, value]) => ({
    name,
    value,
  }));

  const COLORS = [
    "#facc15", // amarillo WeldZone
    "#3b82f6",
    "#22c55e",
    "#ef4444",
    "#a855f7",
    "#f97316",
  ];

  return (
    <div className="min-h-[80vh]">
      <h2 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-white">
        Panel de Control
      </h2>

      {loading ? (
        <p className="text-center text-zinc-500 animate-pulse">
          Cargando datos del sistema...
        </p>
      ) : (
        <>
          {/* Tarjetas de métricas */}
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            <MetricCard
              icon={<Package className="w-8 h-8 text-yellow-500" />}
              label="Total de productos"
              value={total}
            />
            <MetricCard
              icon={<TrendingUp className="w-8 h-8 text-green-500" />}
              label="Productos activos"
              value={activos}
            />
            <MetricCard
              icon={<TrendingDown className="w-8 h-8 text-red-500" />}
              label="Descontinuados"
              value={descontinuados}
            />
          </div>

          {/* Gráfica */}
          <div className="bg-white dark:bg-zinc-800 shadow rounded-lg p-5 border border-zinc-200 dark:border-zinc-700">
            <h3 className="text-lg font-semibold mb-4 text-zinc-800 dark:text-zinc-100">
              Distribución por categoría
            </h3>

            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, value }) => `${name} (${value})`}
                  >
                    {chartData.map((_, i) => (
                      <Cell
                        key={`cell-${i}`}
                        fill={COLORS[i % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#18181b",
                      color: "#fff",
                      borderRadius: "8px",
                      border: "none",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 py-10 text-zinc-500">
                <AlertTriangle className="w-6 h-6 text-yellow-500" />
                <p>No hay productos disponibles para mostrar.</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// 💡 Componente de tarjeta de métrica
function MetricCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.03 }}
      className="bg-white dark:bg-zinc-800 shadow rounded-xl p-5 flex items-center gap-4 border border-zinc-200 dark:border-zinc-700 transition"
    >
      {icon}
      <div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{label}</p>
        <p className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          {value}
        </p>
      </div>
    </motion.div>
  );
}
