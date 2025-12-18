import api from './api.js';

export const addressService = {
  // Get user addresses
  getAddresses: async () => {
    const response = await api.get('/addresses');
    return response.data;
  },

  // Get default address
  getDefaultAddress: async () => {
    const response = await api.get('/addresses/default');
    return response.data;
  },

  // Get address by ID
  getAddressById: async (id) => {
    const response = await api.get(`/addresses/${id}`);
    return response.data;
  },

  // Create address
  createAddress: async (addressData) => {
    const response = await api.post('/addresses', addressData);
    return response.data;
  },

  // Update address
  updateAddress: async (id, addressData) => {
    const response = await api.put(`/addresses/${id}`, addressData);
    return response.data;
  },

  // Delete address
  deleteAddress: async (id) => {
    const response = await api.delete(`/addresses/${id}`);
    return response.data;
  },
};

