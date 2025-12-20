import api from './api.js';

/**
 * Chat with AI assistant
 * @param {Array<{role: 'user' | 'assistant', content: string}>} messages - Conversation messages
 * @returns {Promise<string>} AI reply
 */
export const chatWithAI = async (messages) => {
  const response = await api.post('/ai/chat', { messages });
  return response.data.reply;
};
