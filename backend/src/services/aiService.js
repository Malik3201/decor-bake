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
 * Generate system message with website knowledge
 */
const generateSystemMessage = async () => {
  const knowledgeBase = await getWebsiteKnowledge();
  
  const categoriesList = knowledgeBase.categories
    .map(cat => `- ${cat.name}`)
    .join('\n');

  const productsList = knowledgeBase.products
    .slice(0, 50)
    .map(prod => `- ${prod.title} (Category: ${prod.category})`)
    .join('\n');

    return `
    You are Coco, the DecoraBake cake assistant for a premium ecommerce store.
    
    **Tone**: Super friendly, helpful, warm, and concise. Use natural conversational style.  
    **Emojis**: Use sparingly to highlight excitement or friendliness (like 🍓🎂✨), but keep it classy.
    
    **Formatting**: 
    - Short paragraphs (1-2 sentences)
    - Bullet points for lists
    - Bold key items or suggestions
    - Keep responses clean and visually readable
    - Maximum 4 lines
    
    **Capabilities**:
    - Suggest cake flavors, custom designs, and decorations 🎂
    - Recommend pairings or complementary products 🍓
    - Help users navigate categories or find specific items
    - Encourage custom orders if the exact product isn’t available
    
    **Restrictions**:
    - Never mention prices, discounts, or rates
    - Avoid saying “product not found” in a blunt way
    - Keep responses positive and encouraging
    
    **Website Knowledge**:
    
    Available Categories:
    ${categoriesList}
    
    Available Products (sample):
    ${productsList}
    `.trim();
};

/**
 * Chat with AI using LongCat AI
 */
export const aiChat = async (messages) => {
  const apiKey = process.env.AI_API_KEY;
  const model = process.env.AI_MODEL || 'LongCat-Flash-Chat';
  // Use the full endpoint URL directly - don't append /chat/completions
  const baseUrl = process.env.AI_BASE_URL || 'https://api.longcat.chat/openai/v1/chat/completions';

  if (!apiKey) {
    const err = new AppError('AI API key not configured');
    err.statusCode = 503;
    throw err;
  }

  // Generate system message with website knowledge
  const systemContent = await generateSystemMessage();

  const body = {
    model,
    messages: [
      { role: 'system', content: systemContent },
      ...messages,
    ],
    max_tokens: process.env.AI_MAX_TOKENS ? parseInt(process.env.AI_MAX_TOKENS) : 1500,
    temperature: 0.7,
  };

  try {
    // Use baseUrl directly - it should be the complete endpoint URL
    const resp = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!resp.ok) {
      const text = await resp.text();
      const err = new AppError('AI request failed');
      err.statusCode = resp.status;
      err.details = text;
      throw err;
    }

    const data = await resp.json();
    const content = data.choices?.[0]?.message?.content || '';
    return content;
  } catch (error) {
    console.error('AI error', error);
    if (error instanceof AppError) {
      throw error;
    }
    const err = new AppError('AI temporarily unavailable');
    err.statusCode = 503;
    throw err;
  }
};
