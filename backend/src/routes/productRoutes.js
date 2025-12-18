import express from 'express';
import {
  createProduct,
  getProducts,
  getProductById,
  getProductBySlug,
  getFeaturedProducts,
  getProductsByCategory,
  updateProduct,
  deleteProduct,
  getProductPrice,
  getShippingFee,
} from '../controllers/productController.js';
import { protect, authorize } from '../middlewares/auth.js';
import { validate } from '../middlewares/validator.js';
import {
  createProductValidator,
  updateProductValidator,
} from '../validators/productValidator.js';
import { USER_ROLES } from '../config/constants.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/category/:categoryId', getProductsByCategory);
router.get('/slug/:slug', getProductBySlug);
router.get('/:id/price', getProductPrice);
router.get('/:id/shipping', getShippingFee);
router.get('/:id', getProductById);

// Admin routes
router.post('/', protect, authorize(USER_ROLES.ADMIN), createProductValidator, validate, createProduct);
router.put('/:id', protect, authorize(USER_ROLES.ADMIN), updateProductValidator, validate, updateProduct);
router.delete('/:id', protect, authorize(USER_ROLES.ADMIN), deleteProduct);

export default router;

