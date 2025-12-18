import api from './api.js';

export const paymentService = {
  // Create payment intent
  createPaymentIntent: async () => {
    // Server will calculate amount from the current user's cart
    const response = await api.post('/payments/intent');
    return response.data;
  },
};

