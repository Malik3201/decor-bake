import express from 'express';
import {
  createPromoCode,
  getPromoCodes,
  getPromoCodeById,
  validatePromoCode,
  updatePromoCode,
  deletePromoCode,
} from '../controllers/promoController.js';
import { protect, authorize } from '../middlewares/auth.js';
import { validate } from '../middlewares/validator.js';
import {
  createPromoValidator,
  updatePromoValidator,
  validatePromoValidator,
} from '../validators/promoValidator.js';
import { USER_ROLES } from '../config/constants.js';

const router = express.Router();

// Public route
router.post('/validate', validatePromoValidator, validate, validatePromoCode);

// Admin routes
router.get('/', protect, authorize(USER_ROLES.ADMIN), getPromoCodes);
router.get('/:id', protect, authorize(USER_ROLES.ADMIN), getPromoCodeById);
router.post('/', protect, authorize(USER_ROLES.ADMIN), createPromoValidator, validate, createPromoCode);
router.put('/:id', protect, authorize(USER_ROLES.ADMIN), updatePromoValidator, validate, updatePromoCode);
router.delete('/:id', protect, authorize(USER_ROLES.ADMIN), deletePromoCode);

export default router;

