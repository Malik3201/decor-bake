import api from './api.js';

export const categoryService = {
  // Get all categories
  getCategories: async (isActive = true) => {
    const response = await api.get('/categories', { params: { isActive } });
    return response.data;
  },

  // Get category by ID
  getCategoryById: async (id) => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  // Get category by slug
  getCategoryBySlug: async (slug) => {
    const response = await api.get(`/categories/slug/${slug}`);
    return response.data;
  },
};

