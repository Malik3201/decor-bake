import { body } from 'express-validator';

export const updateSettingsValidator = [
  body('defaultShippingFee')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Default shipping fee must be a positive number'),
  body('freeShippingThreshold')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Free shipping threshold must be a positive number'),
  body('announcementText')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Announcement text must be less than 500 characters'),
  body('siteStatus')
    .optional()
    .isIn(['active', 'maintenance', 'coming_soon'])
    .withMessage('Site status must be one of: active, maintenance, coming_soon'),
  body('currency')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 3, max: 3 })
    .withMessage('Currency must be a 3-character code (e.g., USD)'),
];

