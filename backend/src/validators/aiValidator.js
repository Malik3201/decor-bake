import { body } from 'express-validator';

export const chatValidator = [
  body('messages')
    .isArray({ min: 1 })
    .withMessage('messages must be a non-empty array'),
  body('messages.*.role')
    .isIn(['user', 'assistant'])
    .withMessage('Message role must be either "user" or "assistant"'),
  body('messages.*.content')
    .trim()
    .notEmpty()
    .withMessage('Message content is required')
    .isLength({ min: 1, max: 2000 })
    .withMessage('Message content must be between 1 and 2000 characters'),
];
