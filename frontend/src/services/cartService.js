import api from './api.js';

export const cartService = {
  // Get cart
  getCart: async () => {
    const response = await api.get('/cart');
    return response.data;
  },

  // Add to cart
  addToCart: async (productId, quantity, variants = null) => {
    const payload = {
      productId,
      quantity,
    };

    // Only send variants if an object with keys is provided
    if (variants && typeof variants === 'object' && Object.keys(variants).length > 0) {
      payload.variants = variants;
    }

    const response = await api.post('/cart/items', payload);
    return response.data;
  },

  // Update cart item
  updateCartItem: async (itemId, quantity) => {
    const response = await api.put(`/cart/items/${itemId}`, { quantity });
    return response.data;
  },

  // Remove from cart
  removeFromCart: async (itemId) => {
    const response = await api.delete(`/cart/items/${itemId}`);
    return response.data;
  },

  // Clear cart
  clearCart: async () => {
    const response = await api.delete('/cart/clear');
    return response.data;
  },

  // Apply promo code
  applyPromoCode: async (promoCode) => {
    const response = await api.post('/cart/promo', { promoCode });
    return response.data;
  },

  // Remove promo code
  removePromoCode: async () => {
    const response = await api.delete('/cart/promo');
    return response.data;
  },
};

