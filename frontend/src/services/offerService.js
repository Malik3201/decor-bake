import api from './api.js';

export const offerService = {
  // Get all offers
  getOffers: async (params = {}) => {
    const response = await api.get('/offers', { params });
    return response.data;
  },

  // Get active offers
  getActiveOffers: async () => {
    const response = await api.get('/offers/active');
    return response.data;
  },

  // Get offer by ID
  getOfferById: async (id) => {
    const response = await api.get(`/offers/${id}`);
    return response.data;
  },

  // Get offer products
  getOfferProducts: async (id) => {
    const response = await api.get(`/offers/${id}/products`);
    return response.data;
  },
};

