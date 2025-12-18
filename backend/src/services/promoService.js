import PromoCode from '../models/PromoCode.js';
import { AppError } from '../utils/errorHandler.js';
import { DEFAULT_PAGINATION } from '../config/constants.js';

export const createPromoCode = async (promoData) => {
  // Ensure code is uppercase
  promoData.code = promoData.code.toUpperCase();

  // Check if code already exists
  const existingPromo = await PromoCode.findOne({
    code: promoData.code,
    isDeleted: false,
  });

  if (existingPromo) {
    throw new AppError('Promo code already exists', 400);
  }

  const promoCode = await PromoCode.create(promoData);
  return promoCode;
};

export const getPromoCodes = async (options = {}) => {
  const {
    page = DEFAULT_PAGINATION.PAGE,
    limit = DEFAULT_PAGINATION.LIMIT,
    isActive,
    expired,
  } = options;

  const query = { isDeleted: false };

  if (isActive !== undefined) {
    query.isActive = isActive;
  }

  const now = new Date();
  if (expired === 'true') {
    query.expiryDate = { $lt: now };
  } else if (expired === 'false') {
    query.expiryDate = { $gte: now };
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [promoCodes, total] = await Promise.all([
    PromoCode.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    PromoCode.countDocuments(query),
  ]);

  return {
    promoCodes,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit)),
    },
  };
};

export const getPromoCodeById = async (id) => {
  const promoCode = await PromoCode.findById(id);
  if (!promoCode || promoCode.isDeleted) {
    throw new AppError('Promo code not found', 404);
  }
  return promoCode;
};

export const getPromoCodeByCode = async (code) => {
  const promoCode = await PromoCode.findOne({
    code: code.toUpperCase(),
    isDeleted: false,
  });
  return promoCode;
};

export const validatePromoCode = async (code, cartTotal = 0) => {
  const promoCode = await PromoCode.findOne({
    code: code.toUpperCase(),
    isActive: true,
    isDeleted: false,
  });

  if (!promoCode) {
    throw new AppError('Invalid promo code', 400);
  }

  const now = new Date();
  if (promoCode.expiryDate < now) {
    throw new AppError('Promo code has expired', 400);
  }

  if (promoCode.usedCount >= promoCode.usageLimit) {
    throw new AppError('Promo code usage limit reached', 400);
  }

  if (cartTotal < promoCode.minPurchaseAmount) {
    throw new AppError(
      `Minimum purchase amount of ${promoCode.minPurchaseAmount} required`,
      400
    );
  }

  // Calculate discount
  let discount = 0;
  if (promoCode.discountType === 'percentage') {
    discount = cartTotal * (promoCode.discountValue / 100);
    if (promoCode.maxDiscountAmount) {
      discount = Math.min(discount, promoCode.maxDiscountAmount);
    }
  } else {
    discount = Math.min(promoCode.discountValue, cartTotal);
  }

  return {
    promoCode: {
      id: promoCode._id,
      code: promoCode.code,
      discountType: promoCode.discountType,
      discountValue: promoCode.discountValue,
      maxDiscountAmount: promoCode.maxDiscountAmount,
    },
    discount: Math.round(discount * 100) / 100,
    isValid: true,
  };
};

export const updatePromoCode = async (id, updateData) => {
  const promoCode = await PromoCode.findById(id);
  if (!promoCode || promoCode.isDeleted) {
    throw new AppError('Promo code not found', 404);
  }

  // If updating code, check uniqueness
  if (updateData.code) {
    updateData.code = updateData.code.toUpperCase();
    const existingPromo = await PromoCode.findOne({
      code: updateData.code,
      _id: { $ne: id },
      isDeleted: false,
    });

    if (existingPromo) {
      throw new AppError('Promo code already exists', 400);
    }
  }

  Object.keys(updateData).forEach(key => {
    if (updateData[key] !== undefined) {
      promoCode[key] = updateData[key];
    }
  });

  await promoCode.save();
  return promoCode;
};

export const deletePromoCode = async (id) => {
  const promoCode = await PromoCode.findById(id);
  if (!promoCode || promoCode.isDeleted) {
    throw new AppError('Promo code not found', 404);
  }

  await promoCode.softDelete();
  return promoCode;
};

export const incrementPromoUsage = async (code) => {
  const promoCode = await PromoCode.findOne({
    code: code.toUpperCase(),
    isDeleted: false,
  });

  if (promoCode && promoCode.usedCount < promoCode.usageLimit) {
    promoCode.usedCount += 1;
    await promoCode.save();
  }
};

