import { useState, useEffect, memo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { Button } from '../components/common/Button.jsx';
import { Loading } from '../components/common/Loading.jsx';
import { settingsService } from '../services/settingsService.js';

// Cart Item Component
const CartItem = memo(({ item, onQuantityChange, onRemove }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const product = item.productId;
  const price = item.discountPrice || item.price;
  const total = price * item.quantity;
  const hasDiscount = item.discountPrice && item.discountPrice < item.price;

  const handleQuantityChange = async (newQuantity) => {
    setIsUpdating(true);
    await onQuantityChange(item._id, newQuantity);
    setIsUpdating(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-soft p-4 md:p-6 flex flex-col sm:flex-row gap-4 animate-fade-in">
      {/* Product Image */}
      <Link
        to={`/products/${product._id}`}
        className="flex-shrink-0 w-full sm:w-28 h-28 rounded-xl overflow-hidden bg-gray-100 group"
      >
        <img
          src={product.images?.[0] || '/placeholder-product.jpg'}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </Link>

      {/* Product Info */}
      <div className="flex-grow min-w-0">
        <Link
          to={`/products/${product._id}`}
          className="block text-lg font-semibold text-gray-900 hover:text-pink-600 transition-colors mb-1 line-clamp-2"
        >
          {product.title}
        </Link>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          {hasDiscount ? (
            <>
              <span className="text-lg font-bold text-pink-600">
                ${item.discountPrice.toFixed(2)}
              </span>
              <span className="text-sm text-gray-400 line-through">
                ${item.price.toFixed(2)}
              </span>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded">
                Save ${(item.price - item.discountPrice).toFixed(2)}
              </span>
            </>
          ) : (
            <span className="text-lg font-bold text-gray-900">
              ${item.price.toFixed(2)}
            </span>
          )}
        </div>

        {/* Quantity Control */}
        <div className="flex items-center gap-4">
          <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={isUpdating}
              className="w-10 h-10 flex items-center justify-center hover:bg-pink-50 text-gray-600 hover:text-pink-600 transition-colors disabled:opacity-50"
            >
              {item.quantity === 1 ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              ) : (
                <span className="text-xl">−</span>
              )}
            </button>
            <span className="w-12 text-center font-semibold text-gray-900">
              {isUpdating ? (
                <svg className="w-4 h-4 mx-auto animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                item.quantity
              )}
            </span>
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={isUpdating}
              className="w-10 h-10 flex items-center justify-center hover:bg-pink-50 text-gray-600 hover:text-pink-600 transition-colors disabled:opacity-50"
            >
              <span className="text-xl">+</span>
            </button>
          </div>
          <button
            onClick={() => onRemove(item._id)}
            className="text-red-500 hover:text-red-600 text-sm font-medium flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Remove
          </button>
        </div>
      </div>

      {/* Total Price */}
      <div className="flex-shrink-0 text-right sm:w-24">
        <p className="text-xs text-gray-500 mb-1">Total</p>
        <p className="text-xl font-bold text-gray-900">${total.toFixed(2)}</p>
      </div>
    </div>
  );
});

CartItem.displayName = 'CartItem';

// Order Summary Component
const OrderSummary = memo(({ cart, freeShippingThreshold, onCheckout }) => {
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - (cart?.subtotal || 0));
  const freeShippingProgress = cart?.subtotal
    ? Math.min(100, (cart.subtotal / freeShippingThreshold) * 100)
    : 0;

  return (
    <div className="bg-white rounded-2xl shadow-soft p-6 sticky top-24">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

      {/* Free Shipping Progress */}
      {remainingForFreeShipping > 0 && (
        <div className="mb-6 p-4 bg-gradient-to-r from-pink-50 to-pink-100/50 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
            </svg>
            <p className="text-sm text-gray-700">
              Add <span className="font-bold text-pink-600">${remainingForFreeShipping.toFixed(2)}</span> for free shipping!
            </p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-pink-400 to-pink-600 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${freeShippingProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {remainingForFreeShipping === 0 && (
        <div className="mb-6 p-4 bg-green-50 rounded-xl flex items-center gap-2">
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
          <p className="text-sm text-green-700 font-medium">You've unlocked free shipping!</p>
        </div>
      )}

      {/* Price Breakdown */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal ({cart?.items?.length || 0} items)</span>
          <span className="font-semibold text-gray-900">${cart?.subtotal?.toFixed(2) || '0.00'}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Shipping</span>
          <span className="font-semibold">
            {cart?.shippingFee === 0 ? (
              <span className="text-green-600">FREE</span>
            ) : (
              `$${cart?.shippingFee?.toFixed(2) || '0.00'}`
            )}
          </span>
        </div>
        {cart?.discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span className="font-semibold">-${cart.discount.toFixed(2)}</span>
          </div>
        )}
        {cart?.promoCode && (
          <div className="flex items-center justify-between text-sm text-gray-500 bg-pink-50 px-3 py-2 rounded-lg">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
              {cart.promoCode}
            </span>
            <span className="text-green-600 font-medium">Applied</span>
          </div>
        )}
        <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-bold text-gray-900">
          <span>Total</span>
          <span className="text-pink-600">${cart?.total?.toFixed(2) || '0.00'}</span>
        </div>
      </div>

      {/* Checkout Button */}
      <Button
        variant="primary"
        size="lg"
        fullWidth
        onClick={onCheckout}
        className="mb-4"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        Proceed to Checkout
      </Button>
      
      <Link to="/">
        <Button variant="outline" size="md" fullWidth>
          Continue Shopping
        </Button>
      </Link>

      {/* Security Badges */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="flex items-center justify-center gap-4 text-gray-400">
          <div className="flex items-center gap-1 text-xs">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Secure Checkout
          </div>
          <div className="flex items-center gap-1 text-xs">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            SSL Protected
          </div>
        </div>
      </div>
    </div>
  );
});

OrderSummary.displayName = 'OrderSummary';

// Empty Cart Component
const EmptyCart = memo(() => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-[60vh] flex items-center justify-center py-12">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-24 h-24 mx-auto mb-6 bg-pink-50 rounded-full flex items-center justify-center">
          <svg className="w-12 h-12 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-600 mb-8">
          Looks like you haven't added anything to your cart yet. Start shopping to fill it up!
        </p>
        <Button variant="primary" size="lg" onClick={() => navigate('/')}>
          Start Shopping
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Button>
      </div>
    </div>
  );
});

EmptyCart.displayName = 'EmptyCart';

// Main Cart Component
export const Cart = () => {
  const { cart, loading, updateCartItem, removeFromCart } = useCart();
  const navigate = useNavigate();
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await settingsService.getSettings();
        setSettings(response.data);
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };
    fetchSettings();
  }, []);

  const handleQuantityChange = useCallback(async (itemId, newQuantity) => {
    if (newQuantity < 1) {
      await removeFromCart(itemId);
    } else {
      await updateCartItem(itemId, newQuantity);
    }
  }, [updateCartItem, removeFromCart]);

  const handleRemove = useCallback(async (itemId) => {
    await removeFromCart(itemId);
  }, [removeFromCart]);

  const handleCheckout = useCallback(() => {
    navigate('/checkout');
  }, [navigate]);

  const freeShippingThreshold = settings?.freeShippingThreshold || 50;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" />
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
          <p className="text-gray-600">
            You have {cart.items.length} item{cart.items.length !== 1 ? 's' : ''} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <CartItem
                key={item._id}
                item={item}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemove}
              />
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummary
              cart={cart}
              freeShippingThreshold={freeShippingThreshold}
              onCheckout={handleCheckout}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
