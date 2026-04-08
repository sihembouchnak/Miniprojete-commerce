import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CreditCardIcon, LockClosedIcon, CheckCircleIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';

const PaymentForm = ({ cartItems, total, onBack }) => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsCompleted(true);

      // Redirect to success page after 2 seconds
      setTimeout(() => {
        navigate('/payment-success');
      }, 2000);
    }, 3000);
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
        <div className="glass rounded-3xl p-12 text-center max-w-md mx-auto">
          <CheckCircleSolid className="w-20 h-20 text-emerald-400 mx-auto mb-6 animate-bounce" />
          <h1 className="text-3xl font-bold text-white mb-4">Payment Successful!</h1>
          <p className="text-slate-400 mb-8">Thank you for your purchase. Your order has been processed successfully.</p>
          <Link to="/" className="btn-primary inline-block">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <button
            onClick={onBack}
            className="inline-flex items-center text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Checkout
          </button>
        </div>

        <div className="glass rounded-3xl p-8">
          <div className="flex items-center mb-8">
            <CreditCardIcon className="w-8 h-8 text-accent-400 mr-3" />
            <h1 className="text-3xl font-bold text-white">Payment Information</h1>
          </div>

          {/* Order Summary */}
          <div className="bg-slate-800/50 rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Order Summary</h2>
            <div className="space-y-2">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-slate-400">{item.name} x{item.quantity}</span>
                  <span className="text-white">${item.price}</span>
                </div>
              ))}
              <div className="border-t border-slate-700 pt-2 mt-4">
                <div className="flex justify-between font-bold text-white">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Payment Method</h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setPaymentMethod('card')}
                className={`p-4 rounded-2xl border-2 transition-all ${
                  paymentMethod === 'card'
                    ? 'border-accent-500 bg-accent-500/10'
                    : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                }`}
              >
                <CreditCardIcon className="w-8 h-8 text-accent-400 mx-auto mb-2" />
                <span className="text-white font-medium">Credit Card</span>
              </button>
              <button
                onClick={() => setPaymentMethod('paypal')}
                className={`p-4 rounded-2xl border-2 transition-all ${
                  paymentMethod === 'paypal'
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                }`}
              >
                <div className="w-8 h-8 bg-blue-600 rounded mx-auto mb-2 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">PP</span>
                </div>
                <span className="text-white font-medium">PayPal</span>
              </button>
            </div>
          </div>

          {/* Payment Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {paymentMethod === 'card' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Card Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-accent-500 focus:outline-none transition-colors pl-12"
                      placeholder="1234 5678 9012 3456"
                      required
                    />
                    <CreditCardIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Expiry Date</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-accent-500 focus:outline-none transition-colors"
                      placeholder="MM/YY"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">CVV</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-accent-500 focus:outline-none transition-colors"
                      placeholder="123"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Cardholder Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-accent-500 focus:outline-none transition-colors"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </>
            )}

            {paymentMethod === 'paypal' && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white text-xl font-bold">PP</span>
                </div>
                <p className="text-slate-400 mb-4">You will be redirected to PayPal to complete your payment.</p>
              </div>
            )}

            {/* Billing Address */}
            <div className="bg-slate-800/30 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Billing Address</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-accent-500 focus:outline-none transition-colors"
                  placeholder="Address"
                  required
                />
                <div className="grid grid-cols-3 gap-4">
                  <input
                    type="text"
                    className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-accent-500 focus:outline-none transition-colors"
                    placeholder="City"
                    required
                  />
                  <input
                    type="text"
                    className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-accent-500 focus:outline-none transition-colors"
                    placeholder="State"
                    required
                  />
                  <input
                    type="text"
                    className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-accent-500 focus:outline-none transition-colors"
                    placeholder="ZIP"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="flex items-center text-sm text-slate-400 bg-slate-800/30 rounded-xl p-4">
              <LockClosedIcon className="w-5 h-5 mr-3 text-emerald-400" />
              <span>Your payment information is encrypted and secure.</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full btn-primary text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Processing Payment...
                </>
              ) : (
                <>
                  <LockClosedIcon className="w-5 h-5 mr-3" />
                  Pay ${total.toFixed(2)}
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;