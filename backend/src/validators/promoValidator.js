import { body } from 'express-validator';

export const createPromoValidator = [
  body('code')
    .trim()
    .notEmpty()
    .withMessage('Promo code is required')
    .isLength({ min: 3, max: 50 })
    .withMessage('Promo code must be between 3 and 50 characters')
    .matches(/^[A-Z0-9]+$/)
    .withMessage('Promo code must contain only uppercase letters and numbers'),
  body('discountType')
    .isIn(['percentage', 'fixed'])
    .withMessage('Discount type must be either "percentage" or "fixed"'),
  body('discountValue')
    .isFloat({ min: 0 })
    .withMessage('Discount value must be a positive number')
    .custom((value, { req }) => {
      if (req.body.discountType === 'percentage' && value > 100) {
        throw new Error('Percentage discount cannot exceed 100');
      }
      return true;
    }),
  body('usageLimit')
    .isInt({ min: 1 })
    .withMessage('Usage limit must be at least 1'),
  body('expiryDate')
    .isISO8601()
    .withMessage('Expiry date must be a valid ISO 8601 date')
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error('Expiry date must be in the future');
      }
      return true;
    }),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
  body('minPurchaseAmount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum purchase amount must be a positive number'),
  body('maxDiscountAmount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum discount amount must be a positive number'),
];

export const updatePromoValidator = [
  body('code')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Promo code cannot be empty')
    .isLength({ min: 3, max: 50 })
    .withMessage('Promo code must be between 3 and 50 characters')
    .matches(/^[A-Z0-9]+$/)
    .withMessage('Promo code must contain only uppercase letters and numbers'),
  body('discountType')
    .optional()
    .isIn(['percentage', 'fixed'])
    .withMessage('Discount type must be either "percentage" or "fixed"'),
  body('discountValue')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Discount value must be a positive number')
    .custom((value, { req }) => {
      if (req.body.discountType === 'percentage' && value > 100) {
        throw new Error('Percentage discount cannot exceed 100');
      }
      return true;
    }),
  body('usageLimit')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Usage limit must be at least 1'),
  body('expiryDate')
    .optional()
    .isISO8601()
    .withMessage('Expiry date must be a valid ISO 8601 date'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
  body('minPurchaseAmount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum purchase amount must be a positive number'),
  body('maxDiscountAmount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum discount amount must be a positive number'),
];

export const validatePromoValidator = [
  body('promoCode')
    .trim()
    .notEmpty()
    .withMessage('Promo code is required')
    .isLength({ min: 3, max: 50 })
    .withMessage('Promo code must be between 3 and 50 characters'),
  body('cartTotal')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Cart total must be a positive number'),
];

