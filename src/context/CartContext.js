import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { cartService } from '../services/apiService';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const setFromCart = useCallback((data) => {
    setCart(data || null);
    const c = Array.isArray(data?.items) ? data.items.length : 0;
    setCount(c);
  }, []);

  const refreshCart = useCallback(async () => {
    if (!user) {
      setFromCart(null);
      return null;
    }
    setLoading(true);
    try {
      const data = await cartService.getCart();
      setFromCart(data);
      return data;
    } catch (e) {
      setFromCart(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, setFromCart]);

  useEffect(() => {
    // Load or reset when auth state changes
    refreshCart();
  }, [refreshCart]);

  const addToCart = useCallback(async (payload) => {
    const data = await cartService.addToCart(payload);
    setFromCart(data);
    return data;
  }, [setFromCart]);

  const removeFromCart = useCallback(async (carId) => {
    const data = await cartService.removeFromCart(carId);
    setFromCart(data);
    return data;
  }, [setFromCart]);

  const clearCart = useCallback(async () => {
    try {
      const data = await cartService.clearCart();
      setFromCart(data);
      if (!data || !Array.isArray(data.items)) {
        setCart({ items: [] });
        setCount(0);
      }
    } catch (e) {
      setFromCart(null);
    }
  }, [setFromCart]);

  const value = { cart, count, loading, refreshCart, setFromCart, addToCart, removeFromCart, clearCart };
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
