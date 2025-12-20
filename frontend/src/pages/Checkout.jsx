import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { Button } from '../components/common/Button.jsx';
import { Modal } from '../components/common/Modal.jsx';
import { AddressForm } from '../components/common/AddressForm.jsx';
import { Loading } from '../components/common/Loading.jsx';
import { addressService } from '../services/addressService.js';
import { orderService } from '../services/orderService.js';
import { paymentService } from '../services/paymentService.js';
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

export const Checkout = () => {
  const { cart, applyPromoCode, removePromoCode, fetchCart } = useCart();
  const { success, error: showError } = useToast();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [promoCode, setPromoCode] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const isStripeReady = !!stripe && !!elements;

  useEffect(() => {
    if (!cart || cart.items.length === 0) {
      navigate('/cart');
      return;
    }

    const fetchAddresses = async () => {
      try {
        setLoading(true);
        const response = await addressService.getAddresses();
        const addressesData = response.data || [];
        setAddresses(addressesData);

        // Select default address or first address
        const defaultAddress = addressesData.find((a) => a.isDefault) || addressesData[0];
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress._id);
        }
      } catch (err) {
        showError('Failed to load addresses');
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, [cart, navigate, showError]);

  const handleAddressSubmit = async (addressData) => {
    try {
      if (editingAddress) {
        await addressService.updateAddress(editingAddress._id, addressData);
        success('Address updated!');
      } else {
        await addressService.createAddress(addressData);
        success('Address saved!');
      }
      setShowAddressModal(false);
      setEditingAddress(null);
      // Refresh addresses
      const response = await addressService.getAddresses();
      setAddresses(response.data || []);
    } catch (err) {
      showError('Failed to save address');
    }
  };

  const handlePromoCode = async () => {
    if (!promoCode.trim()) return;

    setPromoLoading(true);
    try {
      const result = await applyPromoCode(promoCode);
      if (result.success) {
        setPromoCode('');
      }
    } catch (err) {
      // Error handled in context
    } finally {
      setPromoLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      showError('Please select or add an address');
      return;
    }

    setProcessing(true);
    try {
      let paymentIntentId = null;

      if (paymentMethod === 'card') {
        if (!stripe || !elements) {
          showError('Payment system is still loading. Please wait a moment and try again.');
          setProcessing(false);
          return;
        }

        const cardElement = elements.getElement(CardNumberElement);
        if (!cardElement) {
          showError('Card input is not available.');
          setProcessing(false);
          return;
        }

        // Ask backend to create a PaymentIntent based on the current cart
        const piResponse = await paymentService.createPaymentIntent();
        const clientSecret = piResponse.data.clientSecret;

        const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
          },
        });

        if (stripeError) {
          showError(stripeError.message || 'Card payment failed');
          setProcessing(false);
          return;
        }

        if (!paymentIntent || paymentIntent.status !== 'succeeded') {
          showError('Payment was not completed');
          setProcessing(false);
          return;
        }

        paymentIntentId = paymentIntent.id;
      }

      // Create order AFTER successful payment (for card)
      const orderResponse = await orderService.createOrder({
        addressId: selectedAddressId,
        paymentMethod,
        paymentIntentId,
      });

      const order = orderResponse.data;

      success('Order placed successfully!');
      
      // Force refresh cart to clear it locally
      await fetchCart();

      // Redirect to order confirmation
      navigate(`/order-confirmation/${order.orderNumber}`, {
        state: { order },
      });
    } catch (err) {
      showError(err.response?.data?.error || 'Failed to place order');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" />
      </div>
    );
  }

  const selectedAddress = addresses.find((a) => a._id === selectedAddressId);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Address Selection */}
            <div className="bg-white rounded-xl shadow-soft p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Delivery Address</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditingAddress(null);
                    setShowAddressModal(true);
                  }}
                >
                  + Add New
                </Button>
              </div>

              <div className="space-y-3">
                {addresses.length === 0 ? (
                  <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <p className="text-gray-600 font-medium mb-1">No delivery address found</p>
                    <p className="text-gray-400 text-sm mb-6">Please add an address to continue with your order</p>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        setEditingAddress(null);
                        setShowAddressModal(true);
                      }}
                    >
                      Add New Address
                    </Button>
                  </div>
                ) : (
                  addresses.map((address) => (
                    <label
                      key={address._id}
                      className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedAddressId === address._id
                          ? 'border-pink-500 bg-pink-50 shadow-sm'
                          : 'border-gray-200 hover:border-pink-200 hover:bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        value={address._id}
                        checked={selectedAddressId === address._id}
                        onChange={(e) => setSelectedAddressId(e.target.value)}
                        className="sr-only"
                      />
                      <div className="flex items-start justify-between">
                        <div className="flex gap-3">
                          <div className={`mt-1 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            selectedAddressId === address._id ? 'border-pink-500' : 'border-gray-300'
                          }`}>
                            {selectedAddressId === address._id && <div className="w-2 h-2 bg-pink-500 rounded-full" />}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{address.fullName}</p>
                            <p className="text-sm text-gray-600 flex items-center gap-1 mt-0.5">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              {address.phone}
                            </p>
                            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                              {address.addressLine1}, {address.addressLine2 && `${address.addressLine2}, `}
                              <br />
                              {address.city}, {address.state} {address.postalCode}
                            </p>
                            {address.isDefault && (
                              <span className="inline-block mt-2 text-[10px] uppercase tracking-wider font-bold text-pink-500 bg-pink-100 px-2 py-0.5 rounded">
                                Default
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingAddress(address);
                            setShowAddressModal(true);
                          }}
                          className="text-gray-400 hover:text-pink-600 transition-colors p-1"
                          title="Edit address"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      </div>
                    </label>
                  ))
                )}
              </div>
            </div>

            {/* Promo Code */}
            <div className="bg-white rounded-xl shadow-soft p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Promo Code</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  placeholder="Enter promo code"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                />
                <Button
                  variant="primary"
                  onClick={handlePromoCode}
                  disabled={promoLoading || !promoCode.trim()}
                >
                  Apply
                </Button>
              </div>
              {cart.promoCode && (
                <div className="mt-3 flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm text-green-700">
                    Promo code <strong>{cart.promoCode}</strong> applied!
                  </span>
                  <button
                    onClick={() => removePromoCode()}
                    className="text-red-500 hover:text-red-600 text-sm"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl shadow-soft p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Method</h2>
              <div className="space-y-3">
                <label
                  className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === 'card'
                      ? 'border-pink-500 bg-pink-50'
                      : 'border-gray-200 hover:border-pink-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center text-white font-semibold">
                        💳
                      </span>
                      <div>
                        <p className="font-semibold text-gray-900">Card Payment</p>
                        <p className="text-xs text-gray-500">Visa / MasterCard / Stripe test card</p>
                      </div>
                    </div>
                    {paymentMethod === 'card' && (
                      <span className="text-xs font-semibold text-pink-600 bg-pink-50 px-2 py-1 rounded-full">
                        Recommended
                      </span>
                    )}
                  </div>
                </label>

                {paymentMethod === 'card' && (
                  <div className="mt-4 space-y-4 bg-pink-50/60 border border-pink-100 rounded-xl p-4">
                    <p className="text-xs text-gray-600 mb-1">
                      Test card: <span className="font-mono">4242 4242 4242 4242</span>, any future expiry, any CVC.
                    </p>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Card Number
                        </label>
                        <div className="px-3 py-2 bg-white rounded-lg border border-gray-200 focus-within:ring-2 focus-within:ring-pink-500">
                          <CardNumberElement
                            options={{
                              style: {
                                base: {
                                  fontSize: '14px',
                                  color: '#111827',
                                  '::placeholder': { color: '#9CA3AF' },
                                },
                                invalid: { color: '#EF4444' },
                              },
                            }}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Expiry
                          </label>
                          <div className="px-3 py-2 bg-white rounded-lg border border-gray-200 focus-within:ring-2 focus-within:ring-pink-500">
                            <CardExpiryElement />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            CVC
                          </label>
                          <div className="px-3 py-2 bg-white rounded-lg border border-gray-200 focus-within:ring-2 focus-within:ring-pink-500">
                            <CardCvcElement />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <label
                  className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === 'cash_on_delivery'
                      ? 'border-pink-500 bg-pink-50'
                      : 'border-gray-200 hover:border-pink-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cash_on_delivery"
                    checked={paymentMethod === 'cash_on_delivery'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="sr-only"
                  />
                  <span className="font-semibold text-gray-900">Cash on Delivery</span>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-soft p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">${cart.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span className="font-semibold">
                    {cart.shippingFee === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `$${cart.shippingFee.toFixed(2)}`
                    )}
                  </span>
                </div>
                {cart.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span className="font-semibold">-${cart.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>${cart.total.toFixed(2)}</span>
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handlePlaceOrder}
                disabled={
                  processing ||
                  !selectedAddressId ||
                  (paymentMethod === 'card' && !isStripeReady)
                }
                className="mb-4"
              >
                {processing ? 'Processing...' : 'Place Order'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Address Modal */}
      <Modal
        isOpen={showAddressModal}
        onClose={() => {
          setShowAddressModal(false);
          setEditingAddress(null);
        }}
        title={editingAddress ? 'Edit Address' : 'Add New Address'}
        size="md"
      >
        <AddressForm
          address={editingAddress}
          onSubmit={handleAddressSubmit}
          onCancel={() => {
            setShowAddressModal(false);
            setEditingAddress(null);
          }}
        />
      </Modal>
    </div>
  );
};

