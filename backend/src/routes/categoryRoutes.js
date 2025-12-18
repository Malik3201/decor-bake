import express from 'express';
import {
  createCategory,
  getCategories,
  getCategoryById,
  getCategoryBySlug,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import { protect, authorize } from '../middlewares/auth.js';
import { validate } from '../middlewares/validator.js';
import {
  createCategoryValidator,
  updateCategoryValidator,
} from '../validators/categoryValidator.js';
import { USER_ROLES } from '../config/constants.js';

const router = express.Router();

// Public routes
router.get('/', getCategories);
router.get('/slug/:slug', getCategoryBySlug);
router.get('/:id', getCategoryById);

// Admin routes
router.post('/', protect, authorize(USER_ROLES.ADMIN), createCategoryValidator, validate, createCategory);
router.put('/:id', protect, authorize(USER_ROLES.ADMIN), updateCategoryValidator, validate, updateCategory);
router.delete('/:id', protect, authorize(USER_ROLES.ADMIN), deleteCategory);

export default router;

