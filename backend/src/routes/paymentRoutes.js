import express from 'express';
import {
  createPaymentIntent,
  confirmPayment,
  cancelPayment,
  refundPayment,
  getPaymentById,
  getPaymentsByOrder,
  handleWebhook,
} from '../controllers/paymentController.js';
import { protect, authorize } from '../middlewares/auth.js';
import { USER_ROLES } from '../config/constants.js';

const router = express.Router();

// Webhook route (no auth - uses signature verification)
router.post('/webhook', handleWebhook);

// Protected routes
router.use(protect);

router.post('/intent', createPaymentIntent);
router.post('/confirm', confirmPayment);
router.post('/cancel', cancelPayment);
router.get('/order/:orderId', getPaymentsByOrder);
router.get('/:id', getPaymentById);

// Admin routes
router.post('/:id/refund', authorize(USER_ROLES.ADMIN), refundPayment);

export default router;

