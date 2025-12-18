import { asyncHandler } from '../utils/errorHandler.js';
import * as paymentService from '../services/paymentService.js';

export const createPaymentIntent = asyncHandler(async (req, res) => {
  const result = await paymentService.createPaymentIntent(req.user._id);
  res.status(200).json({
    success: true,
    data: result,
  });
});

export const confirmPayment = asyncHandler(async (req, res) => {
  const { paymentIntentId } = req.body;
  const payment = await paymentService.confirmPayment(paymentIntentId, req.user._id);
  res.status(200).json({
    success: true,
    data: payment,
    message: 'Payment confirmed successfully',
  });
});

export const cancelPayment = asyncHandler(async (req, res) => {
  const { paymentIntentId } = req.body;
  const payment = await paymentService.cancelPayment(paymentIntentId, req.user._id);
  res.status(200).json({
    success: true,
    data: payment,
    message: 'Payment cancelled successfully',
  });
});

export const refundPayment = asyncHandler(async (req, res) => {
  const { paymentId } = req.params;
  const { amount } = req.body;
  const payment = await paymentService.refundPayment(paymentId, amount);
  res.status(200).json({
    success: true,
    data: payment,
    message: 'Payment refunded successfully',
  });
});

export const getPaymentById = asyncHandler(async (req, res) => {
  const userId = req.user.role === 'admin' ? null : req.user._id;
  const payment = await paymentService.getPaymentById(req.params.id, userId);
  res.status(200).json({
    success: true,
    data: payment,
  });
});

export const getPaymentsByOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const userId = req.user.role === 'admin' ? null : req.user._id;
  const payments = await paymentService.getPaymentsByOrder(orderId, userId);
  res.status(200).json({
    success: true,
    count: payments.length,
    data: payments,
  });
});

/**
 * STRIPE WEBHOOK CONTROLLER
 * Uses req.body (raw) and signature for verification.
 */
export const handleWebhook = asyncHandler(async (req, res) => {
  const signature = req.headers['stripe-signature'];
  
  if (!signature) {
    return res.status(400).json({ success: false, message: 'Missing stripe-signature' });
  }

  // Pass raw body and signature down to the service
  const result = await paymentService.handleWebhook(req.body, signature);
  res.status(200).json(result);
});
