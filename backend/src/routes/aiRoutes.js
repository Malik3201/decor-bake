import express from 'express';
import { chatWithAI } from '../controllers/aiController.js';
import { validate } from '../middlewares/validator.js';
import { chatValidator } from '../validators/aiValidator.js';

const router = express.Router();

// Public route - anyone can chat with AI
router.post('/chat', chatValidator, validate, chatWithAI);

export default router;

