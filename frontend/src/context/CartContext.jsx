import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import api from '../services/api';

const CartContext = createContext(undefined);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCart = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/cart');
      if (response.data && response.data.success) {
        setCartItems(response.data.cartItems);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch cart');
    } finally {
      setLoading(false);
    }
  }, []);

  const addToCart = useCallback(async (productId, quantity = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/cart', { productId, quantity });
      if (response.data && response.data.success) {
        await fetchCart(); // Refresh cart list
        return true;
      }
      return false;
    } catch (err) {
      setError(err.message || 'Failed to add item to cart');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchCart]);

  const updateQuantity = useCallback(async (cartItemId, quantity) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.patch(`/cart/${cartItemId}`, { quantity });
      if (response.data && response.data.success) {
        setCartItems(prev =>
          prev.map(item => (item.id === cartItemId ? { ...item, quantity } : item))
        );
        return true;
      }
      return false;
    } catch (err) {
      setError(err.message || 'Failed to update quantity');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeFromCart = useCallback(async (cartItemId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.delete(`/cart/${cartItemId}`);
      if (response.data && response.data.success) {
        setCartItems(prev => prev.filter(item => item.id !== cartItemId));
        return true;
      }
      return false;
    } catch (err) {
      setError(err.message || 'Failed to remove item from cart');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  // Sync cart on initial mount
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Calculations
  const cartSubtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      const price = typeof item.price === 'string' ? parseFloat(item.price.replace(/[$,]/g, '')) : item.price;
      return sum + (price * item.quantity);
    }, 0);
  }, [cartItems]);

  const deliveryCharge = useMemo(() => {
    if (cartItems.length === 0) return 0;
    return cartSubtotal > 100 ? 0 : 10; // Free delivery over $100, else $10 flat rate
  }, [cartSubtotal, cartItems]);

  const cartTotal = useMemo(() => {
    return cartSubtotal + deliveryCharge;
  }, [cartSubtotal, deliveryCharge]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        error,
        fetchCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartSubtotal,
        deliveryCharge,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
