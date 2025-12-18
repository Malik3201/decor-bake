import express from 'express';
import {
  createOrder,
  getOrders,
  getOrderById,
  getOrderByOrderNumber,
  getUserOrders,
  updateOrderStatus,
  updatePaymentStatus,
  cancelOrder,
} from '../controllers/orderController.js';
import { protect, authorize } from '../middlewares/auth.js';
import { validate } from '../middlewares/validator.js';
import {
  createOrderValidator,
  updateOrderStatusValidator,
  updatePaymentStatusValidator,
} from '../validators/orderValidator.js';
import { USER_ROLES } from '../config/constants.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// User routes
router.post('/', createOrderValidator, validate, createOrder);
router.get('/my-orders', getUserOrders);
router.get('/order-number/:orderNumber', getOrderByOrderNumber);
router.get('/:id', getOrderById);
router.put('/:id/cancel', cancelOrder);

// Admin routes
router.get('/', authorize(USER_ROLES.ADMIN), getOrders);
router.put('/:id/status', authorize(USER_ROLES.ADMIN), updateOrderStatusValidator, validate, updateOrderStatus);
router.put('/:id/payment-status', authorize(USER_ROLES.ADMIN), updatePaymentStatusValidator, validate, updatePaymentStatus);

export default router;

