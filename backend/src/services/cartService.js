import mongoose from 'mongoose';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { AppError } from '../utils/errorHandler.js';

export const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ userId }).populate('items.productId', 'title price images slug isActive productShippingFee');
  
  if (!cart) {
    cart = await Cart.create({ userId });
  }

  // Remove invalid items (deleted or inactive products)
  cart.items = cart.items.filter(item => {
    const product = item.productId;
    return product && !product.isDeleted && product.isActive;
  });

  // Recalculate cart
  await cart.recalculate();
  await cart.save();

  return cart.populate('items.productId', 'title price images slug isActive productShippingFee');
};

export const addToCart = async (userId, productId, quantity, variants = null) => {
  const product = await Product.findById(productId);
  if (!product || product.isDeleted || !product.isActive) {
    throw new AppError('Product not found or unavailable', 404);
  }

  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = await Cart.create({ userId });
  }

  // Check if product already exists in cart
  const existingItemIndex = cart.items.findIndex(
    item => item.productId.toString() === productId.toString() &&
    JSON.stringify(item.variants) === JSON.stringify(variants)
  );

  if (existingItemIndex > -1) {
    cart.items[existingItemIndex].quantity += quantity;
  } else {
    cart.items.push({
      productId,
      quantity,
      variants,
      price: product.price,
    });
  }

  // Recalculate cart
  await cart.recalculate();
  await cart.save();

  return cart.populate('items.productId', 'title price images slug isActive productShippingFee');
};

export const updateCartItem = async (userId, itemId, quantity) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) {
    throw new AppError('Cart not found', 404);
  }

  const itemIndex = cart.items.findIndex(
    item => item._id.toString() === itemId.toString()
  );

  if (itemIndex === -1) {
    throw new AppError('Cart item not found', 404);
  }

  cart.items[itemIndex].quantity = quantity;

  // Recalculate cart
  await cart.recalculate();
  await cart.save();

  return cart.populate('items.productId', 'title price images slug isActive productShippingFee');
};

export const removeFromCart = async (userId, itemId) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) {
    throw new AppError('Cart not found', 404);
  }

  cart.items = cart.items.filter(
    item => item._id.toString() !== itemId.toString()
  );

  // Recalculate cart
  await cart.recalculate();
  await cart.save();

  return cart.populate('items.productId', 'title price images slug isActive productShippingFee');
};

export const clearCart = async (userId) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) {
    throw new AppError('Cart not found', 404);
  }

  cart.items = [];
  cart.subtotal = 0;
  cart.shippingFee = 0;
  cart.discount = 0;
  cart.promoCode = null;
  cart.total = 0;
  cart.lastCalculatedAt = new Date();

  await cart.save();
  return cart;
};

export const applyPromoCode = async (userId, promoCode) => {
  const PromoCode = mongoose.model('PromoCode');
  const now = new Date();

  const promo = await PromoCode.findOne({
    code: promoCode.toUpperCase(),
    isActive: true,
    isDeleted: false,
    expiryDate: { $gte: now },
  });

  if (!promo) {
    throw new AppError('Invalid or expired promo code', 400);
  }

  if (promo.usedCount >= promo.usageLimit) {
    throw new AppError('Promo code usage limit reached', 400);
  }

  const cart = await Cart.findOne({ userId });
  if (!cart) {
    throw new AppError('Cart not found', 404);
  }

  if (cart.items.length === 0) {
    throw new AppError('Cart is empty', 400);
  }

  cart.promoCode = promo.code;

  // Recalculate cart with promo
  await cart.recalculate();
  await cart.save();

  return cart.populate('items.productId', 'title price images slug isActive productShippingFee');
};

export const removePromoCode = async (userId) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) {
    throw new AppError('Cart not found', 404);
  }

  cart.promoCode = null;

  // Recalculate cart without promo
  await cart.recalculate();
  await cart.save();

  return cart.populate('items.productId', 'title price images slug isActive productShippingFee');
};

