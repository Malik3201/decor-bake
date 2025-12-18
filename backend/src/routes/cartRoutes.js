import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  applyPromoCode,
  removePromoCode,
} from '../controllers/cartController.js';
import { protect } from '../middlewares/auth.js';
import { validate } from '../middlewares/validator.js';
import {
  addToCartValidator,
  updateCartItemValidator,
  applyPromoValidator,
} from '../validators/cartValidator.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.get('/', getCart);
router.post('/items', addToCartValidator, validate, addToCart);
router.put('/items/:itemId', updateCartItemValidator, validate, updateCartItem);
router.delete('/items/:itemId', removeFromCart);
router.delete('/clear', clearCart);
router.post('/promo', applyPromoValidator, validate, applyPromoCode);
router.delete('/promo', removePromoCode);

export default router;

