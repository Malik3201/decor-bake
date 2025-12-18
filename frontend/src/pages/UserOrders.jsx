import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { orderService } from '../services/orderService.js';
import { Loading } from '../components/common/Loading.jsx';
import { Button } from '../components/common/Button.jsx';

export const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await orderService.getUserOrders();
        setOrders(response.data || []);
      } catch (err) {
        console.error('Failed to load orders', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" />
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-soft p-10 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
            <p className="text-gray-600 mb-6">Start shopping and your orders will appear here.</p>
            <Button variant="primary" size="lg" onClick={() => navigate('/')}>
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-xl shadow-soft p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div>
                  <p className="text-sm text-gray-500">
                    Order #
                    <span className="font-semibold text-gray-900 ml-1">
                      {order.orderNumber}
                    </span>
                  </p>
                  <p className="text-xs text-gray-400">
                    Placed on {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
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
                  <p className="text-sm font-semibold text-gray-900">
                    Total: ${order.finalAmount.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {order.items.slice(0, 3).map((item) => (
                  <div
                    key={item._id}
                    className="py-3 flex items-center gap-4"
                  >
                    <img
                      src={item.productSnapshot?.images?.[0] || '/placeholder-product.jpg'}
                      alt={item.productSnapshot?.title}
                      className="w-14 h-14 rounded-lg object-cover bg-gray-100"
                    />
                    <div className="flex-grow">
                      <p className="text-sm font-medium text-gray-900">
                        {item.productSnapshot?.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">
                      ${item.subtotal.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {order.items.length > 3 && (
                <p className="mt-2 text-xs text-gray-500">
                  + {order.items.length - 3} more item(s)
                </p>
              )}

              <div className="mt-4 flex justify-end">
                <Link to={`/order-confirmation/${order.orderNumber}`}>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


