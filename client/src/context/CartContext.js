import React, { createContext, useContext, useMemo, useState } from "react";
import { getCart, setCart } from "../utils/storage";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(getCart());

  const sync = (nextItems) => {
    setItems(nextItems);
    setCart(nextItems);
  };

  const addItem = (product, quantity = 1) => {
    const existing = items.find((item) => item.productId === product._id);
    if (existing) {
      const updated = items.map((item) =>
        item.productId === product._id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
      sync(updated);
      return;
    }
    sync([
      ...items,
      {
        productId: product._id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity
      }
    ]);
  };

  const removeItem = (productId) => {
    sync(items.filter((item) => item.productId !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    sync(
      items.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => sync([]);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      total
    }),
    [items, total]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
