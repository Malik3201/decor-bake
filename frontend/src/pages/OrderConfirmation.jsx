import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/common/Button.jsx';
import { Loading } from '../components/common/Loading.jsx';
import { orderService } from '../services/orderService.js';

export const OrderConfirmation = () => {
  const { orderNumber } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);

  useEffect(() => {
    const fetchOrder = async () => {
      if (order) return;

      try {
        setLoading(true);
        const response = await orderService.getOrderByOrderNumber(orderNumber);
        setOrder(response.data);
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    if (orderNumber) {
      fetchOrder();
    }
  }, [orderNumber, order]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Order not found</h2>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Animation */}
        <div className="text-center mb-8 animate-zoom-in">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-12 h-12 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-600">Thank you for your purchase</p>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-xl shadow-soft p-8 mb-6">
          <div className="border-b border-gray-200 pb-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
            <p className="text-gray-600 mt-1">Order Number: <strong>{order.orderNumber}</strong></p>
          </div>

          {/* Order Items */}
          <div className="space-y-4 mb-6">
            <h3 className="font-semibold text-gray-900">Items</h3>
            {order.items.map((item) => (
              <div key={item._id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <img
                  src={item.productSnapshot?.images?.[0] || '/placeholder-product.jpg'}
                  alt={item.productSnapshot?.title}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-grow">
                  <p className="font-semibold text-gray-900">{item.productSnapshot?.title}</p>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                </div>
                <p className="font-semibold text-gray-900">
                  ${item.subtotal.toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          {/* Price Breakdown */}
          <div className="border-t border-gray-200 pt-6 space-y-2">
            <div className="flex justify-between text-gray-700">
              <span>Subtotal</span>
              <span className="font-semibold">${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Shipping</span>
              <span className="font-semibold">
                {order.shippingFee === 0 ? (
                  <span className="text-green-600">FREE</span>
                ) : (
                  `$${order.shippingFee.toFixed(2)}`
                )}
              </span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span className="font-semibold">-${order.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t border-gray-200">
              <span>Total</span>
              <span>${order.finalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="bg-white rounded-xl shadow-soft p-8 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Delivery Address</h3>
          <div className="text-gray-600">
            <p className="font-semibold text-gray-900">{order.addressSnapshot.fullName}</p>
            <p>{order.addressSnapshot.phone}</p>
            <p className="mt-2">
              {order.addressSnapshot.addressLine1}
              {order.addressSnapshot.addressLine2 && `, ${order.addressSnapshot.addressLine2}`}
            </p>
            <p>
              {order.addressSnapshot.city}, {order.addressSnapshot.state}{' '}
              {order.addressSnapshot.postalCode}
            </p>
            <p>{order.addressSnapshot.country}</p>
          </div>
        </div>

        {/* Order Status */}
        <div className="bg-white rounded-xl shadow-soft p-8 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Order Status</h3>
          <div className="flex items-center gap-3">
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold ${
                order.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : order.status === 'confirmed'
                  ? 'bg-blue-100 text-blue-800'
                  : order.status === 'shipped'
                  ? 'bg-purple-100 text-purple-800'
                  : order.status === 'delivered'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
            {order.trackingNumber && (
              <span className="text-sm text-gray-600">
                Tracking: <strong>{order.trackingNumber}</strong>
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button variant="primary" size="lg" onClick={() => navigate('/orders')} fullWidth>
            View All Orders
          </Button>
          <Button variant="outline" size="lg" onClick={() => navigate('/')} fullWidth>
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
};

