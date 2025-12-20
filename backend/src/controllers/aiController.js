import { asyncHandler } from '../utils/errorHandler.js';
import * as aiService from '../services/aiService.js';

/**
 * Chat with AI assistant
 * POST /api/v1/ai/chat
 */
export const chatWithAI = asyncHandler(async (req, res) => {
  const { query } = req.body;

  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Query is required',
    });
  }

  // Get website knowledge
  const knowledgeBase = await aiService.getWebsiteKnowledge();

  // Generate AI messages
  const { systemMessage, userMessage } = aiService.generateAIMessages(query.trim(), knowledgeBase);

  // Call AI API
  const response = await aiService.callAIAPI(systemMessage, userMessage);

  res.status(200).json({
    success: true,
    data: {
      response,
      assistant: 'Coco',
    },
  });
});

