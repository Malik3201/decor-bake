import api from './api.js';

/**
 * Chat with AI assistant
 * @param {string} query - User's query
 * @returns {Promise<{response: string, assistant: string}>}
 */
export const chatWithAI = async (query) => {
  const response = await api.post('/ai/chat', { query });
  return response.data.data;
};

