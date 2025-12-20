import Product from '../models/Product.js';
import Category from '../models/Category.js';
import { AppError } from '../utils/errorHandler.js';

/**
 * Get website knowledge base (products and categories)
 */
export const getWebsiteKnowledge = async () => {
  try {
    // Get all active categories
    const categories = await Category.find({ isActive: true, isDeleted: false })
      .select('name slug')
      .sort({ orderIndex: 1 });

    // Get all active products with basic info
    const products = await Product.find({ isActive: true, isDeleted: false })
      .select('title slug description categoryId')
      .populate('categoryId', 'name')
      .limit(100); // Limit to avoid too large context

    // Format knowledge base
    const knowledgeBase = {
      categories: categories.map(cat => ({
        name: cat.name,
        slug: cat.slug,
      })),
      products: products.map(prod => ({
        title: prod.title,
        slug: prod.slug,
        description: prod.description?.substring(0, 200) || '', // Limit description length
        category: prod.categoryId?.name || 'Uncategorized',
      })),
    };

    return knowledgeBase;
  } catch (error) {
    throw new AppError('Failed to fetch website knowledge', 500);
  }
};

/**
 * Generate AI system message and user query with website knowledge
 */
export const generateAIMessages = (userQuery, knowledgeBase) => {
  const categoriesList = knowledgeBase.categories.map(cat => `- ${cat.name}`).join('\n');
  const productsList = knowledgeBase.products.slice(0, 50).map(prod => 
    `- ${prod.title} (Category: ${prod.category})`
  ).join('\n');

  const systemMessage = `You are Coco, a friendly and helpful AI assistant for a baking and home decor e-commerce website. 

IMPORTANT RULES:
1. Your name is Coco
2. Keep responses SHORT and CONCISE - maximum 4 lines
3. Format responses cleanly with proper line breaks
4. You have knowledge about the website's products and categories
5. NEVER discuss product prices, rates, or costs with users
6. If asked about prices, politely redirect: "I can help you explore our products, but I can't discuss pricing. Please check the product pages for current prices!"
7. Be friendly, helpful, and professional
8. Focus on helping users find products, understand categories, and navigate the website

WEBSITE KNOWLEDGE:

Available Categories:
${categoriesList}

Available Products (sample):
${productsList}`;

  return {
    systemMessage,
    userMessage: userQuery,
  };
};

/**
 * Call AI API
 */
export const callAIAPI = async (systemMessage, userMessage) => {
  const AI_API_BASE = process.env.AI_API_BASE;
  const AI_API_KEY = process.env.AI_API_KEY;
  const AI_MODEL = process.env.AI_MODEL || 'gpt-3.5-turbo';

  if (!AI_API_BASE || !AI_API_KEY) {
    throw new AppError('AI service is not configured', 500);
  }

  try {
    // Determine if it's OpenAI or another API
    const isOpenAI = AI_API_BASE.includes('openai.com');
    
    let apiUrl, requestBody;

    // Clean base URL (remove trailing slash)
    const baseUrl = AI_API_BASE.replace(/\/$/, '');

    if (isOpenAI) {
      // OpenAI format - base URL should be https://api.openai.com
      apiUrl = baseUrl.includes('/v1') ? `${baseUrl}/chat/completions` : `${baseUrl}/v1/chat/completions`;
      requestBody = {
        model: AI_MODEL,
        messages: [
          {
            role: 'system',
            content: systemMessage,
          },
          {
            role: 'user',
            content: userMessage,
          },
        ],
        max_tokens: 200, // Limit response length
        temperature: 0.7,
      };
    } else {
      // Generic OpenAI-compatible API format
      apiUrl = baseUrl.includes('/chat') ? `${baseUrl}/completions` : `${baseUrl}/chat/completions`;
      requestBody = {
        model: AI_MODEL,
        messages: [
          {
            role: 'system',
            content: systemMessage,
          },
          {
            role: 'user',
            content: userMessage,
          },
        ],
        max_tokens: 200,
        temperature: 0.7,
      };
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AI_API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new AppError(`AI API error: ${response.status} - ${errorData}`, response.status);
    }

    const data = await response.json();
    
    // Extract response text
    let aiResponse = '';
    if (isOpenAI || data.choices) {
      aiResponse = data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';
    } else if (data.response) {
      aiResponse = data.response;
    } else if (data.message) {
      aiResponse = data.message;
    } else {
      aiResponse = JSON.stringify(data);
    }

    // Clean and format response
    aiResponse = aiResponse.trim();
    
    // Ensure it's max 4 lines
    const lines = aiResponse.split('\n').filter(line => line.trim());
    if (lines.length > 4) {
      aiResponse = lines.slice(0, 4).join('\n');
    }

    return aiResponse;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(`AI service error: ${error.message}`, 500);
  }
};

