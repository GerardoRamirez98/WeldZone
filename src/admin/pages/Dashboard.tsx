import { useState } from "react";
import {
  products as initialProducts,
  type Producto,
} from "../../data/products";
import {
  Package,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Pencil,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import RestockModal from "../components/RestockModal";

export default function Dashboard() {
  const [products, setProducts] = useState<Producto[]>(initialProducts);
  const [productoRestock, setProductoRestock] = useState<Producto | null>(null);

  // 👇 Nuevo estado: stock mínimo definido por el admin
  const [minStock, setMinStock] = useState<number>(5);

  const totalProductos = products.length;
  const activos = products.filter((p) => p.estado === "Activo").length;
  const descontinuados = products.filter(
    (p) => p.estado === "Descontinuado"
  ).length;

  const stockTotal = products.reduce((acc, p) => acc + p.stock, 0);
  const porAgotarse = products.filter(
    (p) => p.stock > 0 && p.stock <= minStock
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

  // Filtrar solo productos con bajo stock según minStock
  const lowStock = products
    .filter((p) => p.stock <= minStock)
    .sort((a, b) => a.stock - b.stock);

  const COLORS = ["#facc15", "#3b82f6", "#22c55e", "#ef4444", "#a855f7"];

  // 🔄 función que actualiza el stock y cierra modal
  const handleRestock = (id: number, nuevoStock: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stock: nuevoStock } : p))
    );
    setProductoRestock(null); // 👈 cerramos modal al guardar
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Panel de Control</h2>

      {/* Configuración de stock mínimo */}
      <div className="mb-6 flex items-center gap-4">
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Stock mínimo:
        </label>
        <input
          type="number"
          value={minStock}
          min={1}
          onChange={(e) => setMinStock(Number(e.target.value))}
          className="w-24 p-2 border rounded-md border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-center text-sm"
        />
      </div>

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
          label={`Por debajo de ${minStock}`}
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
                innerRadius={40}
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

          {lowStock.length > 0 ? (
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
                          : "bg-orange-100 text-orange-700 dark:bg-orange-800 dark:text-orange-200"
                      }`}
                    >
                      {p.stock === 0 ? "Sin stock" : `${p.stock} en stock`}
                    </span>
                  </div>

                  {/* Acción: Reabastecer */}
                  <button
                    className="flex items-center gap-1 px-3 py-1 rounded bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold"
                    onClick={() => setProductoRestock(p)}
                  >
                    <Pencil className="w-4 h-4" />
                    Reabastecer
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              ✅ No hay productos por debajo del stock mínimo ({minStock}).
            </p>
          )}
        </div>
      </div>

      {/* Modal de Reabastecer */}
      {productoRestock && (
        <RestockModal
          isOpen={!!productoRestock}
          onClose={() => setProductoRestock(null)}
          producto={productoRestock}
          onRestock={handleRestock}
        />
      )}
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
