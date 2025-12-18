import { asyncHandler } from '../utils/errorHandler.js';
import * as promoService from '../services/promoService.js';

export const createPromoCode = asyncHandler(async (req, res) => {
  const promoCode = await promoService.createPromoCode(req.body);
  res.status(201).json({
    success: true,
    data: promoCode,
  });
});

export const getPromoCodes = asyncHandler(async (req, res) => {
  const { page, limit, isActive, expired } = req.query;
  const result = await promoService.getPromoCodes({
    page,
    limit,
    isActive: isActive !== undefined ? isActive === 'true' : undefined,
    expired,
  });

  res.status(200).json({
    success: true,
    count: result.promoCodes.length,
    pagination: result.pagination,
    data: result.promoCodes,
  });
});

export const getPromoCodeById = asyncHandler(async (req, res) => {
  const promoCode = await promoService.getPromoCodeById(req.params.id);
  res.status(200).json({
    success: true,
    data: promoCode,
  });
});

export const validatePromoCode = asyncHandler(async (req, res) => {
  const { promoCode, cartTotal } = req.body;
  const result = await promoService.validatePromoCode(promoCode, cartTotal);
  res.status(200).json({
    success: true,
    data: result,
  });
});

export const updatePromoCode = asyncHandler(async (req, res) => {
  const promoCode = await promoService.updatePromoCode(req.params.id, req.body);
  res.status(200).json({
    success: true,
    data: promoCode,
    message: 'Promo code updated successfully',
  });
});

export const deletePromoCode = asyncHandler(async (req, res) => {
  await promoService.deletePromoCode(req.params.id);
  res.status(200).json({
    success: true,
    message: 'Promo code deleted successfully',
  });
});

