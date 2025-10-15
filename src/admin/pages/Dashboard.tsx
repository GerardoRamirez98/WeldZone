import { useState, useEffect } from "react";
import { Package, TrendingDown, TrendingUp } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

// 🧩 Tipo de producto según tu backend
type Producto = {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  categoria?: string;
  etiqueta?: string;
  estado?: string;
  imagenUrl?: string;
  specFileUrl?: string;
};

export default function Dashboard() {
  const [products, setProducts] = useState<Producto[]>([]);

  // 🔄 Cargar productos desde el backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:3000/products");
        if (!res.ok) throw new Error("Error al obtener productos");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("❌ Error al cargar productos:", err);
      }
    };

    fetchProducts();
  }, []);

  // 📊 Cálculos de métricas
  const totalProductos = products.length;
  const activos = products.filter((p) => p.estado === "activo").length;
  const descontinuados = products.filter(
    (p) => p.estado === "descontinuado"
  ).length;

  // Agrupar productos por categoría
  const productosPorCategoria = products.reduce(
    (acc: Record<string, number>, p) => {
      const cat = p.categoria || "Sin categoría";
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    },
    {}
  );

  const chartData = Object.entries(productosPorCategoria).map(
    ([categoria, cantidad]) => ({
      name: categoria,
      value: cantidad,
    })
  );

  const COLORS = ["#facc15", "#3b82f6", "#22c55e", "#ef4444", "#a855f7"];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Panel de Control</h2>

      {/* Métricas principales */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card
          icon={<Package className="w-8 h-8 text-yellow-500" />}
          label="Total de productos"
          value={totalProductos}
        />
        <Card
          icon={<TrendingUp className="w-8 h-8 text-green-500" />}
          label="Productos activos"
          value={activos}
        />
        <Card
          icon={<TrendingDown className="w-8 h-8 text-gray-500" />}
          label="Descontinuados"
          value={descontinuados}
        />
      </div>

      {/* Gráfica de categorías */}
      <div className="bg-white dark:bg-zinc-800 shadow rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">
          Distribución por categoría
        </h3>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label={({ name, value }) => `${name} (${value})`}
              >
                {chartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            No hay productos disponibles para mostrar.
          </p>
        )}
      </div>
    </div>
  );
}

/* 🧱 Componente reutilizable para métricas */
function Card({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="bg-white dark:bg-zinc-800 shadow rounded-lg p-4 flex items-center gap-3">
      {icon}
      <div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{label}</p>
        <p className="text-lg font-bold">{value}</p>
      </div>
    </div>
  );
}
