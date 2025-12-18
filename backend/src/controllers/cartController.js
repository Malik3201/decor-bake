import { asyncHandler } from '../utils/errorHandler.js';
import * as cartService from '../services/cartService.js';

export const getCart = asyncHandler(async (req, res) => {
  const cart = await cartService.getOrCreateCart(req.user._id);
  res.status(200).json({
    success: true,
    data: cart,
  });
});

export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity, variants } = req.body;
  const cart = await cartService.addToCart(req.user._id, productId, quantity, variants);
  res.status(200).json({
    success: true,
    data: cart,
    message: 'Item added to cart',
  });
});

export const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const cart = await cartService.updateCartItem(req.user._id, req.params.itemId, quantity);
  res.status(200).json({
    success: true,
    data: cart,
    message: 'Cart item updated',
  });
});

export const removeFromCart = asyncHandler(async (req, res) => {
  const cart = await cartService.removeFromCart(req.user._id, req.params.itemId);
  res.status(200).json({
    success: true,
    data: cart,
    message: 'Item removed from cart',
  });
});

export const clearCart = asyncHandler(async (req, res) => {
  const cart = await cartService.clearCart(req.user._id);
  res.status(200).json({
    success: true,
    data: cart,
    message: 'Cart cleared',
  });
});

export const applyPromoCode = asyncHandler(async (req, res) => {
  const { promoCode } = req.body;
  const cart = await cartService.applyPromoCode(req.user._id, promoCode);
  res.status(200).json({
    success: true,
    data: cart,
    message: 'Promo code applied successfully',
  });
});

export const removePromoCode = asyncHandler(async (req, res) => {
  const cart = await cartService.removePromoCode(req.user._id);
  res.status(200).json({
    success: true,
    data: cart,
    message: 'Promo code removed',
  });
});

