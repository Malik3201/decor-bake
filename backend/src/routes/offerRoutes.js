import express from 'express';
import {
  createOffer,
  getOffers,
  getActiveOffers,
  getOfferById,
  getOfferProducts,
  updateOffer,
  deleteOffer,
} from '../controllers/offerController.js';
import { protect, authorize } from '../middlewares/auth.js';
import { validate } from '../middlewares/validator.js';
import {
  createOfferValidator,
  updateOfferValidator,
} from '../validators/offerValidator.js';
import { USER_ROLES } from '../config/constants.js';

const router = express.Router();

// Public routes
router.get('/active', getActiveOffers);
router.get('/:id/products', getOfferProducts);
router.get('/:id', getOfferById);
router.get('/', getOffers);

// Admin routes
router.post('/', protect, authorize(USER_ROLES.ADMIN), createOfferValidator, validate, createOffer);
router.put('/:id', protect, authorize(USER_ROLES.ADMIN), updateOfferValidator, validate, updateOffer);
router.delete('/:id', protect, authorize(USER_ROLES.ADMIN), deleteOffer);

export default router;

