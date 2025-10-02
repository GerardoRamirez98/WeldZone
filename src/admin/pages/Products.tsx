import { useState } from "react";
import {
  products as initialProducts,
  type Producto,
} from "../../data/products";
import AdminImage from "../components/AdminImage";
import AddProductModal from "../components/AddProductModal";

export default function Products() {
  const [products, setProducts] = useState<Producto[]>(initialProducts);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddProduct = (nuevoProducto: Producto) => {
    setProducts([...products, nuevoProducto]);
  };

  const handleDeleteProduct = (id: number) => {
    if (confirm("¿Seguro que quieres eliminar este producto?")) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  return (
    <div>
      {/* Header con botón */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Gestión de Productos</h2>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          onClick={() => setIsModalOpen(true)}
        >
          + Agregar
        </button>
      </div>

      {/* Grid con cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-stretch">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white dark:bg-zinc-800 shadow rounded-lg p-4 flex flex-col h-full"
          >
            {/* Imagen */}
            <AdminImage src={p.imagen} alt={p.nombre} />

            {/* Píldoras */}
            <div className="flex gap-2 mt-3 flex-wrap">
              {p.estado === "Activo" ? (
                <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200 text-xs font-bold">
                  Activo
                </span>
              ) : (
                <span className="px-2 py-1 rounded-full bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-gray-200 text-xs font-bold">
                  Descontinuado
                </span>
              )}

              {p.etiqueta && (
                <span
                  className={`px-2 py-1 rounded-full text-xs font-bold ${
                    p.etiqueta === "Nuevo"
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200"
                      : "bg-orange-100 text-orange-700 dark:bg-orange-800 dark:text-orange-200"
                  }`}
                >
                  {p.etiqueta}
                </span>
              )}
            </div>

            {/* Nombre */}
            <h3 className="font-semibold text-lg mt-2 min-h-[56px] flex items-center">
              {p.nombre}
            </h3>

            {/* Descripción */}
            <p className="text-sm text-zinc-600 dark:text-zinc-300 line-clamp-2 min-h-[40px]">
              {p.descripcion}
            </p>

            {/* Precio + Stock */}
            <div className="flex justify-between items-center mt-3">
              <span className="font-bold text-yellow-600 dark:text-yellow-400">
                ${p.precio}
              </span>
              {p.stock > 5 ? (
                <span className="text-green-600 font-bold text-sm">
                  {p.stock} en stock
                </span>
              ) : p.stock > 0 ? (
                <span className="text-orange-500 font-bold text-sm">
                  {p.stock} por agotarse
                </span>
              ) : (
                <span className="text-red-600 font-bold text-sm">
                  Sin existencias
                </span>
              )}
            </div>

            {/* Acciones */}
            <div className="flex gap-2 mt-auto pt-4">
              <button className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition w-full">
                Editar
              </button>
              <button
                onClick={() => handleDeleteProduct(p.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition w-full"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal para agregar producto */}
      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddProduct}
      />
    </div>
  );
}
