import api from './api.js';

export const adminService = {
  // Orders
  getOrders: async (params = {}) => {
    const response = await api.get('/orders', { params });
    return response.data;
  },

  updateOrderStatus: async (id, status, trackingNumber = null, notes = null) => {
    const response = await api.put(`/orders/${id}/status`, {
      status,
      trackingNumber,
      notes,
    });
    return response.data;
  },

  updatePaymentStatus: async (id, paymentStatus, paymentIntentId = null) => {
    const response = await api.put(`/orders/${id}/payment-status`, {
      paymentStatus,
      paymentIntentId,
    });
    return response.data;
  },

  // Products
  createProduct: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  updateProduct: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  // Categories
  createCategory: async (categoryData) => {
    const response = await api.post('/categories', categoryData);
    return response.data;
  },

  updateCategory: async (id, categoryData) => {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data;
  },

  deleteCategory: async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },

  // Offers
  createOffer: async (offerData) => {
    const response = await api.post('/offers', offerData);
    return response.data;
  },

  updateOffer: async (id, offerData) => {
    const response = await api.put(`/offers/${id}`, offerData);
    return response.data;
  },

  deleteOffer: async (id) => {
    const response = await api.delete(`/offers/${id}`);
    return response.data;
  },

  // Settings
  updateSettings: async (settingsData) => {
    const response = await api.put('/admin/settings', settingsData);
    return response.data;
  },
};

