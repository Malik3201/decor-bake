import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Offer from '../models/Offer.js';
import Settings from '../models/Settings.js';
import { AppError } from '../utils/errorHandler.js';
import { DEFAULT_PAGINATION } from '../config/constants.js';

export const createProduct = async (productData) => {
  // Verify category exists
  const category = await Category.findById(productData.categoryId);
  if (!category || category.isDeleted) {
    throw new AppError('Category not found', 404);
  }

  const product = await Product.create(productData);
  return product;
};

export const getProducts = async (options = {}) => {
  const {
    page = DEFAULT_PAGINATION.PAGE,
    limit = DEFAULT_PAGINATION.LIMIT,
    categoryId,
    isActive,
    isFeatured,
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = options;

  const query = { isDeleted: false };

  if (categoryId) {
    query.categoryId = categoryId;
  }

  if (isActive !== undefined) {
    query.isActive = isActive;
  }

  if (isFeatured !== undefined) {
    query.isFeatured = isFeatured;
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

  const [products, total] = await Promise.all([
    Product.find(query)
      .populate('categoryId', 'name slug')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit)),
    Product.countDocuments(query),
  ]);

  return {
    products,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit)),
    },
  };
};

export const getProductById = async (id) => {
  const product = await Product.findOne({ _id: id, isDeleted: false })
    .populate('categoryId', 'name slug');
  
  if (!product) {
    throw new AppError('Product not found', 404);
  }

  return product;
};

export const getProductBySlug = async (slug) => {
  const product = await Product.findOne({ slug, isDeleted: false })
    .populate('categoryId', 'name slug');
  
  if (!product) {
    throw new AppError('Product not found', 404);
  }

  return product;
};

export const getFeaturedProducts = async (limit = 10) => {
  const products = await Product.find({
    isFeatured: true,
    isActive: true,
    isDeleted: false,
  })
    .populate('categoryId', 'name slug')
    .sort({ createdAt: -1 })
    .limit(parseInt(limit));

  return products;
};

export const getProductsByCategory = async (categoryId, limit = 20) => {
  const products = await Product.find({
    categoryId,
    isActive: true,
    isDeleted: false,
  })
    .populate('categoryId', 'name slug')
    .sort({ createdAt: -1 })
    .limit(parseInt(limit));

  return products;
};

export const updateProduct = async (id, updateData) => {
  const product = await Product.findById(id);
  if (!product || product.isDeleted) {
    throw new AppError('Product not found', 404);
  }

  // Verify category if being updated
  if (updateData.categoryId) {
    const category = await Category.findById(updateData.categoryId);
    if (!category || category.isDeleted) {
      throw new AppError('Category not found', 404);
    }
  }

  Object.keys(updateData).forEach(key => {
    if (updateData[key] !== undefined) {
      product[key] = updateData[key];
    }
  });

  await product.save();
  return product.populate('categoryId', 'name slug');
};

export const deleteProduct = async (id) => {
  const product = await Product.findById(id);
  if (!product || product.isDeleted) {
    throw new AppError('Product not found', 404);
  }

  await product.softDelete();
  return product;
};

export const calculateProductPrice = async (productId) => {
  const product = await Product.findById(productId);
  if (!product || product.isDeleted) {
    throw new AppError('Product not found', 404);
  }

  // Get active offers for this product
  const now = new Date();
  const activeOffers = await Offer.find({
    productIds: productId,
    isActive: true,
    isDeleted: false,
    startDate: { $lte: now },
    endDate: { $gte: now },
  }).sort({ discountPercentage: -1 });

  let finalPrice = product.price;
  let discountPercentage = 0;
  let offer = null;
  let remainingTime = null;

  if (activeOffers.length > 0) {
    // Use the offer with highest discount
    offer = activeOffers[0];
    discountPercentage = offer.discountPercentage;
    finalPrice = product.price * (1 - discountPercentage / 100);
    remainingTime = Math.max(0, offer.endDate.getTime() - now.getTime());
  }

  return {
    originalPrice: product.price,
    finalPrice: Math.round(finalPrice * 100) / 100,
    discountPercentage,
    offer: offer ? {
      id: offer._id,
      title: offer.title,
      discountPercentage: offer.discountPercentage,
      remainingTime,
    } : null,
  };
};

export const calculateShippingFee = async (productId, cartTotal = 0) => {
  const product = await Product.findById(productId);
  if (!product || product.isDeleted) {
    throw new AppError('Product not found', 404);
  }

  const settings = await Settings.getSettings();

  // Use product-specific shipping fee if available
  if (product.productShippingFee !== null) {
    return product.productShippingFee;
  }

  // Check if cart total exceeds free shipping threshold
  if (cartTotal >= settings.freeShippingThreshold) {
    return 0;
  }

  return settings.defaultShippingFee;
};

