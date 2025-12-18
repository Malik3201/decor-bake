import { body } from 'express-validator';

export const createOfferValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Offer title is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Offer title must be between 3 and 200 characters'),
  body('productIds')
    .isArray({ min: 1 })
    .withMessage('At least one product ID is required'),
  body('productIds.*')
    .isMongoId()
    .withMessage('Invalid product ID'),
  body('discountPercentage')
    .isFloat({ min: 0, max: 100 })
    .withMessage('Discount percentage must be between 0 and 100'),
  body('startDate')
    .isISO8601()
    .withMessage('Start date must be a valid ISO 8601 date'),
  body('endDate')
    .isISO8601()
    .withMessage('End date must be a valid ISO 8601 date')
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.startDate)) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
];

export const updateOfferValidator = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Offer title cannot be empty')
    .isLength({ min: 3, max: 200 })
    .withMessage('Offer title must be between 3 and 200 characters'),
  body('productIds')
    .optional()
    .isArray({ min: 1 })
    .withMessage('At least one product ID is required'),
  body('productIds.*')
    .optional()
    .isMongoId()
    .withMessage('Invalid product ID'),
  body('discountPercentage')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Discount percentage must be between 0 and 100'),
  body('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO 8601 date'),
  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid ISO 8601 date')
    .custom((value, { req }) => {
      if (req.body.startDate && new Date(value) <= new Date(req.body.startDate)) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
];

