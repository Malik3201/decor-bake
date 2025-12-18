import Stripe from 'stripe';
import Payment from '../models/Payment.js';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import { AppError } from '../utils/errorHandler.js';

import 'dotenv/config'; // Force immediate load if not already loaded

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (!stripeSecretKey) {
  console.warn('⚠️ WARNING: STRIPE_SECRET_KEY is not set in backend/.env. Stripe payments will not work.');
} else {
  console.log('✅ Stripe configuration detected.');
}

const stripe = stripeSecretKey ? new Stripe(stripeSecretKey.trim(), { apiVersion: '2024-06-20' }) : null;

/**
 * Creates a Stripe PaymentIntent.
 * Used during checkout initialization.
 */
export const createPaymentIntent = async (userId) => {
  if (!stripe) {
    throw new AppError('Stripe is not configured on the server', 500);
  }

  const cart = await Cart.findOne({ userId });
  if (!cart || cart.items.length === 0) {
    throw new AppError('Cart is empty', 400);
  }

  await cart.recalculate();
  await cart.save();

  const amountInCents = Math.round(cart.total * 100);
  if (amountInCents <= 0) {
    throw new AppError('Cart total must be greater than zero', 400);
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInCents,
    currency: 'usd',
    metadata: {
      userId: userId.toString(),
      type: 'cart_payment'
    },
    automatic_payment_methods: {
      enabled: true,
    },
  });

  return {
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
    amount: cart.total,
    currency: 'usd',
  };
};

/**
 * Confirming a payment manually on the backend.
 * Usually webhooks are preferred, but this can be used for double-checking.
 */
export const confirmPayment = async (paymentIntentId, userId) => {
  if (!stripe) {
    throw new AppError('Stripe is not configured on the server', 500);
  }

  const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
  if (!intent || intent.metadata.userId !== userId.toString()) {
    throw new AppError('Payment intent not found for this user', 404);
  }

  if (intent.status !== 'succeeded') {
    throw new AppError(`Payment status: ${intent.status}`, 400);
  }

  return await updatePaymentAndOrderByIntent(intent);
};

/**
 * Cancels a PaymentIntent.
 */
export const cancelPayment = async (paymentIntentId, userId) => {
  if (!stripe) {
    throw new AppError('Stripe is not configured', 500);
  }

  const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
  if (!intent || intent.metadata.userId !== userId.toString()) {
    throw new AppError('Payment not found', 404);
  }

  if (intent.status === 'succeeded') {
    throw new AppError('Cannot cancel a completed payment', 400);
  }

  const cancelledIntent = await stripe.paymentIntents.cancel(paymentIntentId);
  
  await Payment.findOneAndUpdate(
    { paymentIntentId },
    { status: 'cancelled' },
    { upsert: true }
  );

  return cancelledIntent;
};

/**
 * Processes a refund for a payment.
 */
export const refundPayment = async (paymentId, amount = null) => {
  if (!stripe) {
    throw new AppError('Stripe is not configured', 500);
  }

  const payment = await Payment.findById(paymentId);
  if (!payment) {
    throw new AppError('Payment not found', 404);
  }

  if (payment.status !== 'completed') {
    throw new AppError('Only completed payments can be refunded', 400);
  }

  const refundOptions = {
    payment_intent: payment.paymentIntentId,
  };
  if (amount) {
    refundOptions.amount = Math.round(amount * 100);
  }

  const refund = await stripe.refunds.create(refundOptions);

  payment.status = 'refunded';
  payment.refundAmount = amount || (refund.amount / 100);
  payment.refundedAt = new Date();
  payment.metadata = { ...payment.metadata, stripeRefundId: refund.id };
  await payment.save();

  if (payment.orderId) {
    await Order.findByIdAndUpdate(payment.orderId, { paymentStatus: 'refunded' });
  }

  return payment;
};

/**
 * Shared logic to update Payment and Order based on Stripe PaymentIntent status.
 */
const updatePaymentAndOrderByIntent = async (intent) => {
  const { userId } = intent.metadata;
  const paymentIntentId = intent.id;

  const payment = await Payment.findOneAndUpdate(
    { paymentIntentId },
    {
      userId,
      amount: intent.amount / 100,
      currency: intent.currency.toUpperCase(),
      paymentMethod: intent.payment_method_types[0] || 'card',
      paymentProvider: 'stripe',
      status: intent.status === 'succeeded' ? 'completed' : 'failed',
      metadata: intent.metadata,
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  // If the payment succeeded, look for an associated order or create/update one
  if (intent.status === 'succeeded') {
    // Note: Order creation usually happens BEFORE payment in many flows,
    // but here we might be creating it on success if we use the cart flow.
    // Ideally, the orderId should be in metadata.
    if (intent.metadata.orderId) {
      const order = await Order.findById(intent.metadata.orderId);
      if (order) {
        order.paymentStatus = 'completed';
        order.paymentIntentId = paymentIntentId;
        await order.save();
        payment.orderId = order._id;
        await payment.save();
      }
    } else {
      // Find order by paymentIntentId if it was already created during checkout
      const order = await Order.findOne({ paymentIntentId });
      if (order) {
        order.paymentStatus = 'completed';
        await order.save();
        payment.orderId = order._id;
        await payment.save();
      }
    }
  }

  return payment;
};

/**
 * Validates and routes Stripe webhook events.
 */
export const handleWebhook = async (rawBody, signature) => {
  if (!stripe || !stripeWebhookSecret) {
    throw new AppError('Stripe Webhook is not configured correctly', 500);
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, stripeWebhookSecret);
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    throw new AppError(`Webhook Error: ${err.message}`, 400);
  }

  console.log(`Processing Stripe Webhook: ${event.type}`);

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await updatePaymentAndOrderByIntent(event.data.object);
        break;
      case 'payment_intent.payment_failed':
        await updatePaymentAndOrderByIntent(event.data.object);
        break;
      case 'payment_intent.processing':
        // Optional: Update status to processing
        break;
      case 'charge.refunded':
        // Optional: Handle outside refunds
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    return { received: true };
  } catch (error) {
    console.error('Error handling webhook event:', error);
    throw new AppError('Internal Webhook Error', 500);
  }
};

export const getPaymentById = async (paymentId, userId = null) => {
  const query = { _id: paymentId, isDeleted: false };
  if (userId) query.userId = userId;

  const payment = await Payment.findOne(query)
    .populate('orderId', 'orderNumber finalAmount status')
    .populate('userId', 'name email');

  if (!payment) throw new AppError('Payment not found', 404);
  return payment;
};

export const getPaymentsByOrder = async (orderId, userId = null) => {
  const query = { orderId, isDeleted: false };
  if (userId) query.userId = userId;

  return await Payment.find(query)
    .populate('userId', 'name email')
    .sort({ createdAt: -1 });
};
