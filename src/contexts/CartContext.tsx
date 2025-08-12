import React, { createContext, useContext, useMemo, useState } from "react";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  qty: number;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
  removeItem: (id: string) => void;
  clear: () => void;
  totalQty: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem: CartContextType["addItem"] = (item, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, qty: i.qty + qty } : i));
      }
      return [...prev, { ...item, qty }];
    });
  };

  const removeItem = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));
  const clear = () => setItems([]);

  const { totalQty, totalPrice } = useMemo(() => {
    const totalQty = items.reduce((sum, i) => sum + i.qty, 0);
    const totalPrice = items.reduce((sum, i) => sum + i.qty * i.price, 0);
    return { totalQty, totalPrice };
  }, [items]);

  const value: CartContextType = { items, addItem, removeItem, clear, totalQty, totalPrice };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
