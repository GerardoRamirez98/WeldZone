/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import type { Product } from "../types/products";

// ✅ Tipado del carrito extendido
export interface CartItem extends Product {
  cantidad: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, cantidad?: number) => void;
  updateQuantity: (id: number, cantidad: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // ✅ Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    const saved = localStorage.getItem("weldzone_cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  // ✅ Guardar carrito cuando cambie
  useEffect(() => {
    localStorage.setItem("weldzone_cart", JSON.stringify(cart));
  }, [cart]);

  // 🛒 Agregar o aumentar cantidad de un producto
  const addToCart = (product: Product, cantidad: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      if (existing) {
        // Si ya existe, aumenta la cantidad
        return prev.map((p) =>
          p.id === product.id ? { ...p, cantidad: p.cantidad + cantidad } : p
        );
      }
      // Si no existe, lo agrega
      return [...prev, { ...product, cantidad }];
    });
  };

  // 🔢 Actualizar cantidad manualmente
  const updateQuantity = (id: number, cantidad: number) => {
    setCart(
      (prev) =>
        prev
          .map((p) =>
            p.id === id ? { ...p, cantidad: Math.max(0, cantidad) } : p
          )
          .filter((p) => p.cantidad > 0) // Si llega a 0, se elimina
    );
  };

  // ❌ Eliminar producto
  const removeFromCart = (id: number) =>
    setCart((prev) => prev.filter((p) => p.id !== id));

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ✅ Hook de acceso
export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de CartProvider");
  return ctx;
};
