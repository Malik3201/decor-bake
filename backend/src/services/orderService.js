import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Address from '../models/Address.js';
import PromoCode from '../models/PromoCode.js';
import { AppError } from '../utils/errorHandler.js';
import { DEFAULT_PAGINATION } from '../config/constants.js';
import { confirmPayment as confirmStripePayment } from './paymentService.js';

export const createOrder = async (userId, orderData) => {
  const { addressId, paymentMethod = 'card', notes, paymentIntentId } = orderData;

  // Get user's cart
  const cart = await Cart.findOne({ userId }).populate('items.productId');
  if (!cart || cart.items.length === 0) {
    throw new AppError('Cart is empty', 400);
  }

  // Get address
  const address = await Address.findOne({
    _id: addressId,
    userId,
    isDeleted: false,
  });

  if (!address) {
    throw new AppError('Address not found', 404);
  }

  // Recalculate cart to ensure prices are current
  await cart.recalculate();
  await cart.save();

  // For card payments, verify the Stripe PaymentIntent BEFORE creating the order
  if (paymentMethod === 'card') {
    if (!paymentIntentId) {
      throw new AppError('Payment intent ID is required for card payments', 400);
    }

    const payment = await confirmStripePayment(paymentIntentId, userId);

    // Basic amount check: Stripe amount (in cents) should match current cart total
    const expectedAmountInCents = Math.round(cart.total * 100);
    const actualAmountInCents = Math.round(payment.amount * 100);
    
    if (actualAmountInCents !== expectedAmountInCents) {
      console.error(`💰 Payment mismatch: expected ${expectedAmountInCents} cents, got ${actualAmountInCents} cents`);
      // Relaxed check: if difference is less than 2 cents, allow it but log it
      if (Math.abs(actualAmountInCents - expectedAmountInCents) > 1) {
        throw new AppError(`Payment amount mismatch. Expected: $${cart.total}, Paid: $${payment.amount}`, 400);
      }
    }
  }

  // Create address snapshot
  const addressSnapshot = {
    fullName: address.fullName,
    phone: address.phone,
    addressLine1: address.addressLine1,
    addressLine2: address.addressLine2,
    city: address.city,
    state: address.state,
    postalCode: address.postalCode,
    country: address.country,
  };

  // Create order items with product snapshots
  const orderItems = cart.items.map(item => {
    const product = item.productId;
    return {
      productId: product._id,
      productSnapshot: {
        title: product.title,
        price: product.price,
        images: product.images,
        slug: product.slug,
      },
      quantity: item.quantity,
      variants: item.variants,
      unitPrice: item.price,
      discountPrice: item.discountPrice,
      discountPercentage: item.discountPercentage,
      subtotal: item.discountPrice * item.quantity,
    };
  });

  // Create order (only after successful payment for card)
  const order = await Order.create({
    userId,
    items: orderItems,
    addressSnapshot,
    subtotal: cart.subtotal,
    shippingFee: cart.shippingFee,
    discount: cart.discount,
    promoCode: cart.promoCode,
    finalAmount: cart.total,
    paymentMethod,
    paymentIntentId: paymentMethod === 'card' ? paymentIntentId : null,
    notes,
    paymentStatus: paymentMethod === 'cash_on_delivery' ? 'pending' : 'pending',
    status: 'pending',
  });

  // Increment promo code usage if applied
  if (cart.promoCode) {
    await PromoCode.updateOne(
      { code: cart.promoCode },
      { $inc: { usedCount: 1 } }
    );
  }

  // Clear cart
  cart.items = [];
  cart.subtotal = 0;
  cart.shippingFee = 0;
  cart.discount = 0;
  cart.promoCode = null;
  cart.total = 0;
  await cart.save();

  return order.populate('items.productId', 'title price images slug');
};

export const getOrders = async (options = {}) => {
  const {
    userId,
    page = DEFAULT_PAGINATION.PAGE,
    limit = DEFAULT_PAGINATION.LIMIT,
    status,
    paymentStatus,
  } = options;

  const query = { isDeleted: false };

  if (userId) {
    query.userId = userId;
  }

  if (status) {
    query.status = status;
  }

  if (paymentStatus) {
    query.paymentStatus = paymentStatus;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [orders, total] = await Promise.all([
    Order.find(query)
      .populate('userId', 'name email')
      .populate('items.productId', 'title price images slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    Order.countDocuments(query),
  ]);

  return {
    orders,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit)),
    },
  };
};

export const getOrderById = async (orderId, userId = null) => {
  const query = { _id: orderId, isDeleted: false };
  if (userId) {
    query.userId = userId;
  }

  const order = await Order.findOne(query)
    .populate('userId', 'name email')
    .populate('items.productId', 'title price images slug');

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  return order;
};

export const getOrderByOrderNumber = async (orderNumber, userId = null) => {
  const query = { orderNumber, isDeleted: false };
  if (userId) {
    query.userId = userId;
  }

  const order = await Order.findOne(query)
    .populate('userId', 'name email')
    .populate('items.productId', 'title price images slug');

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  return order;
};

export const getUserOrders = async (userId, options = {}) => {
  const {
    page = DEFAULT_PAGINATION.PAGE,
    limit = DEFAULT_PAGINATION.LIMIT,
    status,
  } = options;

  const query = {
    userId,
    isDeleted: false,
  };

  if (status) {
    query.status = status;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [orders, total] = await Promise.all([
    Order.find(query)
      .populate('items.productId', 'title price images slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    Order.countDocuments(query),
  ]);

  return {
    orders,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit)),
    },
  };
};

export const updateOrderStatus = async (orderId, status, trackingNumber = null, notes = null) => {
  const order = await Order.findById(orderId);
  if (!order || order.isDeleted) {
    throw new AppError('Order not found', 404);
  }

  order.status = status;
  if (trackingNumber) {
    order.trackingNumber = trackingNumber;
  }
  if (notes !== null) {
    order.notes = notes;
  }

  await order.save();
  return order.populate('items.productId', 'title price images slug');
};

export const updatePaymentStatus = async (orderId, paymentStatus, paymentIntentId = null) => {
  const order = await Order.findById(orderId);
  if (!order || order.isDeleted) {
    throw new AppError('Order not found', 404);
  }

  order.paymentStatus = paymentStatus;
  if (paymentIntentId) {
    order.paymentIntentId = paymentIntentId;
  }

  // Auto-update order status based on payment
  if (paymentStatus === 'completed' && order.status === 'pending') {
    order.status = 'confirmed';
  }

  await order.save();
  return order.populate('items.productId', 'title price images slug');
};

export const cancelOrder = async (orderId, userId) => {
  const order = await Order.findOne({
    _id: orderId,
    userId,
    isDeleted: false,
  });

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  // Only allow cancellation if order is pending or confirmed
  if (!['pending', 'confirmed'].includes(order.status)) {
    throw new AppError('Order cannot be cancelled at this stage', 400);
  }

  order.status = 'cancelled';
  if (order.paymentStatus === 'completed') {
    order.paymentStatus = 'refunded';
  }

  await order.save();
  return order.populate('items.productId', 'title price images slug');
};

