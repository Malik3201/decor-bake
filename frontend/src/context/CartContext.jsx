import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { cartService } from '../services/cartService.js';
import { useToast } from './ToastContext.jsx';
import { useAuth } from './AuthContext.jsx';
import { STORAGE_KEYS } from '../utils/constants.js';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const { success, error } = useToast();
  const { isAuthenticated } = useAuth();

  // Hydrate cart from localStorage immediately for better UX
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem(STORAGE_KEYS.CART);
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
    } catch (e) {
      console.error('Failed to parse stored cart', e);
      localStorage.removeItem(STORAGE_KEYS.CART);
    }
  }, []);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(null);
      return;
    }

    try {
      setLoading(true);
      const response = await cartService.getCart();
      setCart(response.data);
      // Persist latest server cart
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(response.data));
    } catch (err) {
      console.error('Error fetching cart:', err);
      setCart(null);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1, variants = null) => {
    if (!isAuthenticated) {
      error('Please login to add items to cart');
      return { success: false };
    }

    try {
      const response = await cartService.addToCart(productId, quantity, variants);
      setCart(response.data);
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(response.data));
      success('Item added to cart!');
      return { success: true, data: response.data };
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to add item to cart';
      error(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    try {
      const response = await cartService.updateCartItem(itemId, quantity);
      setCart(response.data);
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(response.data));
      return { success: true, data: response.data };
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to update cart item';
      error(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const response = await cartService.removeFromCart(itemId);
      setCart(response.data);
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(response.data));
      success('Item removed from cart');
      return { success: true, data: response.data };
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to remove item';
      error(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const clearCart = async () => {
    try {
      await cartService.clearCart();
      setCart(null);
      localStorage.removeItem(STORAGE_KEYS.CART);
      success('Cart cleared');
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to clear cart';
      error(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const applyPromoCode = async (promoCode) => {
    try {
      const response = await cartService.applyPromoCode(promoCode);
      setCart(response.data);
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(response.data));
      success('Promo code applied!');
      return { success: true, data: response.data };
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Invalid promo code';
      error(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const removePromoCode = async () => {
    try {
      const response = await cartService.removePromoCode();
      setCart(response.data);
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(response.data));
      success('Promo code removed');
      return { success: true, data: response.data };
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to remove promo code';
      error(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const value = useMemo(() => ({
    cart,
    loading,
    fetchCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    applyPromoCode,
    removePromoCode,
    itemCount: cart?.items?.length || 0,
    total: cart?.total || 0,
  }), [cart, loading, fetchCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

