import api from './api.js';

export const promoService = {
  // Validate promo code
  validatePromoCode: async (promoCode, cartTotal = 0) => {
    const response = await api.post('/promos/validate', { promoCode, cartTotal });
    return response.data;
  },

  // Get all promo codes (admin)
  getPromoCodes: async (params = {}) => {
    const response = await api.get('/promos', { params });
    return response.data;
  },

  // Get promo code by ID (admin)
  getPromoCodeById: async (id) => {
    const response = await api.get(`/promos/${id}`);
    return response.data;
  },

  // Create promo code (admin)
  createPromoCode: async (promoData) => {
    const response = await api.post('/promos', promoData);
    return response.data;
  },

  // Update promo code (admin)
  updatePromoCode: async (id, promoData) => {
    const response = await api.put(`/promos/${id}`, promoData);
    return response.data;
  },

  // Delete promo code (admin)
  deletePromoCode: async (id) => {
    const response = await api.delete(`/promos/${id}`);
    return response.data;
  },
};

