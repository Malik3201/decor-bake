import { asyncHandler } from '../utils/errorHandler.js';
import * as orderService from '../services/orderService.js';

export const createOrder = asyncHandler(async (req, res) => {
  const order = await orderService.createOrder(req.user._id, req.body);
  res.status(201).json({
    success: true,
    data: order,
    message: 'Order created successfully',
  });
});

export const getOrders = asyncHandler(async (req, res) => {
  const { page, limit, status, paymentStatus } = req.query;
  const userId = req.user.role === 'admin' ? undefined : req.user._id;

  const result = await orderService.getOrders({
    userId,
    page,
    limit,
    status,
    paymentStatus,
  });

  res.status(200).json({
    success: true,
    count: result.orders.length,
    pagination: result.pagination,
    data: result.orders,
  });
});

export const getOrderById = asyncHandler(async (req, res) => {
  const userId = req.user.role === 'admin' ? null : req.user._id;
  const order = await orderService.getOrderById(req.params.id, userId);
  res.status(200).json({
    success: true,
    data: order,
  });
});

export const getOrderByOrderNumber = asyncHandler(async (req, res) => {
  const userId = req.user.role === 'admin' ? null : req.user._id;
  const order = await orderService.getOrderByOrderNumber(req.params.orderNumber, userId);
  res.status(200).json({
    success: true,
    data: order,
  });
});

export const getUserOrders = asyncHandler(async (req, res) => {
  const { page, limit, status } = req.query;
  const result = await orderService.getUserOrders(req.user._id, {
    page,
    limit,
    status,
  });

  res.status(200).json({
    success: true,
    count: result.orders.length,
    pagination: result.pagination,
    data: result.orders,
  });
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, trackingNumber, notes } = req.body;
  const order = await orderService.updateOrderStatus(
    req.params.id,
    status,
    trackingNumber,
    notes
  );
  res.status(200).json({
    success: true,
    data: order,
    message: 'Order status updated successfully',
  });
});

export const updatePaymentStatus = asyncHandler(async (req, res) => {
  const { paymentStatus, paymentIntentId } = req.body;
  const order = await orderService.updatePaymentStatus(
    req.params.id,
    paymentStatus,
    paymentIntentId
  );
  res.status(200).json({
    success: true,
    data: order,
    message: 'Payment status updated successfully',
  });
});

export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await orderService.cancelOrder(req.params.id, req.user._id);
  res.status(200).json({
    success: true,
    data: order,
    message: 'Order cancelled successfully',
  });
});

