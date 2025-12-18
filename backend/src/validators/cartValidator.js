import { body } from 'express-validator';

export const addToCartValidator = [
  body('productId')
    .notEmpty()
    .withMessage('Product ID is required')
    .isMongoId()
    .withMessage('Invalid product ID'),
  body('quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  // Variants are optional; allow null/undefined and only validate when an object is actually provided
  body('variants')
    .optional({ nullable: true })
    .isObject()
    .withMessage('Variants must be an object when provided'),
];

export const updateCartItemValidator = [
  body('quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
];

export const applyPromoValidator = [
  body('promoCode')
    .trim()
    .notEmpty()
    .withMessage('Promo code is required')
    .isLength({ min: 3, max: 50 })
    .withMessage('Promo code must be between 3 and 50 characters'),
];

