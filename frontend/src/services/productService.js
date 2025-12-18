import api from './api.js';

export const productService = {
  // Get all products
  getProducts: async (params = {}) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  // Get product by ID
  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Get product by slug
  getProductBySlug: async (slug) => {
    const response = await api.get(`/products/slug/${slug}`);
    return response.data;
  },

  // Get featured products
  getFeaturedProducts: async (limit = 10) => {
    const response = await api.get('/products/featured', { params: { limit } });
    return response.data;
  },

  // Get products by category
  getProductsByCategory: async (categoryId, limit = 20) => {
    const response = await api.get(`/products/category/${categoryId}`, { params: { limit } });
    return response.data;
  },

  // Get product price (with offers)
  getProductPrice: async (id) => {
    const response = await api.get(`/products/${id}/price`);
    return response.data;
  },

  // Get shipping fee
  getShippingFee: async (id, cartTotal = 0) => {
    const response = await api.get(`/products/${id}/shipping`, { params: { cartTotal } });
    // Backend responds with { success, data: { shippingFee } }
    return response.data.data;
  },
};

