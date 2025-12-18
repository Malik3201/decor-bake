import { body } from 'express-validator';

export const createProductValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Product title is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Product title must be between 3 and 200 characters'),
  body('description')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 5000 })
    .withMessage('Description must be less than 5000 characters'),
  body('categoryId')
    .notEmpty()
    .withMessage('Category ID is required')
    .isMongoId()
    .withMessage('Invalid category ID'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('images')
    .optional()
    .isArray()
    .withMessage('Images must be an array'),
  body('images.*')
    .optional()
    .isString()
    .withMessage('Each image must be a valid URL or path'),
  body('isFeatured')
    .optional()
    .isBoolean()
    .withMessage('isFeatured must be a boolean'),
  body('variants')
    .optional()
    .isObject()
    .withMessage('Variants must be an object'),
  body('customFields')
    .optional()
    .isObject()
    .withMessage('Custom fields must be an object'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
  body('productShippingFee')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Product shipping fee must be a positive number'),
];

export const updateProductValidator = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Product title cannot be empty')
    .isLength({ min: 3, max: 200 })
    .withMessage('Product title must be between 3 and 200 characters'),
  body('description')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 5000 })
    .withMessage('Description must be less than 5000 characters'),
  body('categoryId')
    .optional()
    .isMongoId()
    .withMessage('Invalid category ID'),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('images')
    .optional()
    .isArray()
    .withMessage('Images must be an array'),
  body('images.*')
    .optional()
    .isString()
    .withMessage('Each image must be a valid URL or path'),
  body('isFeatured')
    .optional()
    .isBoolean()
    .withMessage('isFeatured must be a boolean'),
  body('variants')
    .optional()
    .isObject()
    .withMessage('Variants must be an object'),
  body('customFields')
    .optional()
    .isObject()
    .withMessage('Custom fields must be an object'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
  body('productShippingFee')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Product shipping fee must be a positive number'),
];

