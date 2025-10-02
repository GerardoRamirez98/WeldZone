import { products } from "../../data/products";
import {
  Package,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Pencil,
  Plus,
} from "lucide-react";
import { Link } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export default function Dashboard() {
  const totalProductos = products.length;
  const activos = products.filter((p) => p.estado === "Activo").length;
  const descontinuados = products.filter(
    (p) => p.estado === "Descontinuado"
  ).length;

  const stockTotal = products.reduce((acc, p) => acc + p.stock, 0);
  const porAgotarse = products.filter(
    (p) => p.stock > 0 && p.stock <= 5
  ).length;
  const sinExistencias = products.filter((p) => p.stock === 0).length;

  // Agrupar stock por categoría
  const stockPorCategoria = products.reduce(
    (acc: Record<string, number>, p) => {
      acc[p.categoria] = (acc[p.categoria] || 0) + p.stock;
      return acc;
    },
    {}
  );

  const chartData = Object.entries(stockPorCategoria).map(
    ([categoria, stock]) => ({
      name: categoria,
      value: stock,
    })
  );

  // Top 3 productos con menor stock
  const lowStock = [...products].sort((a, b) => a.stock - b.stock).slice(0, 3);

  const COLORS = ["#facc15", "#3b82f6", "#22c55e", "#ef4444", "#a855f7"];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Panel de Control</h2>

      {/* Métricas */}
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
        <Card
          icon={<Package className="w-8 h-8 text-blue-500" />}
          label="Stock total"
          value={stockTotal}
        />
        <Card
          icon={<AlertTriangle className="w-8 h-8 text-orange-500" />}
          label="Por agotarse"
          value={porAgotarse}
        />
        <Card
          icon={<AlertTriangle className="w-8 h-8 text-red-500" />}
          label="Sin existencias"
          value={sinExistencias}
        />
      </div>

      {/* Grid con gráfica y lista crítica en paralelo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfica por categoría */}
        <div className="bg-white dark:bg-zinc-800 shadow rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Stock por categoría</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={40} // donut minimalista
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
        </div>

        {/* Lista de bajo stock */}
        <div className="bg-white dark:bg-zinc-800 shadow rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">
            Productos con bajo stock
          </h3>
          <ul className="space-y-2">
            {lowStock.map((p) => (
              <li
                key={p.id}
                className="flex justify-between items-center p-2 rounded-md border border-zinc-200 dark:border-zinc-700"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{p.nombre}</span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full w-fit ${
                      p.stock === 0
                        ? "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200"
                        : p.stock <= 5
                        ? "bg-orange-100 text-orange-700 dark:bg-orange-800 dark:text-orange-200"
                        : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
                    }`}
                  >
                    {p.stock === 0 ? "Sin stock" : `${p.stock} en stock`}
                  </span>
                </div>

                {/* Acciones */}
                <div className="flex gap-2">
                  <Link
                    to={`/admin/products`}
                    className="p-1 rounded-full bg-yellow-500 hover:bg-yellow-600 text-white"
                  >
                    <Pencil className="w-4 h-4" />
                  </Link>
                  <button
                    className="p-1 rounded-full bg-green-500 hover:bg-green-600 text-white"
                    onClick={() => alert(`Reabastecer ${p.nombre}`)} // en futuro → abrir modal
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* Componente reutilizable para métricas */
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
