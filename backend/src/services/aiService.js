import Product from '../models/Product.js';
import Category from '../models/Category.js';
import { AppError } from '../utils/errorHandler.js';

/**
 * Get website knowledge base (products and categories)
 */
export const getWebsiteKnowledge = async () => {
  try {
    const categories = await Category.find({ isActive: true, isDeleted: false })
      .select('name slug')
      .sort({ orderIndex: 1 });

    const products = await Product.find({ isActive: true, isDeleted: false })
      .select('title slug description categoryId')
      .populate('categoryId', 'name')
      .limit(100);

    return {
      categories: categories.map(cat => ({
        name: cat.name,
        slug: cat.slug,
      })),
      products: products.map(prod => ({
        title: prod.title,
        slug: prod.slug,
        description: prod.description?.substring(0, 200) || '',
        category: prod.categoryId?.name || 'Uncategorized',
      })),
    };
  } catch {
    throw new AppError('Failed to fetch website knowledge', 500);
  }
};

/**
 * Generate AI messages
 */
export const generateAIMessages = (userQuery, knowledgeBase) => {
  const categoriesList = knowledgeBase.categories
    .map(cat => `- ${cat.name}`)
    .join('\n');

  const productsList = knowledgeBase.products
    .slice(0, 50)
    .map(prod => `- ${prod.title} (Category: ${prod.category})`)
    .join('\n');

  const systemMessage = `
You are Coco, the AI assistant of this website.

STRICT RULES:
- Max 4 lines response
- Clean and simple formatting
- Website-related help only
- NEVER discuss prices or costs
- Be friendly and professional

WEBSITE DATA:

Categories:
${categoriesList}

Products:
${productsList}
`;

  return [
    { role: 'system', content: systemMessage.trim() },
    { role: 'user', content: userQuery },
  ];
};

/**
 * Call LongCat AI API
 */
export const callAIAPI = async (messages) => {
  const { AI_API_BASE, AI_API_KEY, AI_MODEL } = process.env;

  if (!AI_API_BASE || !AI_API_KEY || !AI_MODEL) {
    throw new AppError('AI environment variables are missing', 500);
  }

  try {
    const apiUrl = `${AI_API_BASE.replace(/\/$/, '')}/chat/completions`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AI_API_KEY}`,
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages,
        temperature: 0.4,
        max_tokens: 180,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new AppError(err, response.status);
    }

    const data = await response.json();
    let reply = data?.choices?.[0]?.message?.content || '';

    // Clean + max 4 lines
    reply = reply
      .split('\n')
      .map(l => l.trim())
      .filter(Boolean)
      .slice(0, 4)
      .join('\n');

    return reply || 'Sorry, I could not respond properly.';
  } catch (err) {
    throw new AppError(`LongCat AI Error: ${err.message}`, 500);
  }
};
