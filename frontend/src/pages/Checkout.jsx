import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { CreditCardIcon, TruckIcon, ShieldCheckIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import PaymentForm from '../components/PaymentForm.jsx';

const Checkout = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [showPayment, setShowPayment] = useState(false);
  const [isGuestCheckout, setIsGuestCheckout] = useState(false);

  // Mock cart items - in real app, this would come from cart context
  const cartItems = [
    { id: 1, name: 'AI Resume Builder', price: 9.99, quantity: 1 },
    { id: 2, name: 'Code Autocompletion Pro', price: 19.99, quantity: 1 },
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const handleGuestCheckout = () => {
    setIsGuestCheckout(true);
    setShowPayment(true);
  };

  const handleLoginCheckout = () => {
    navigate('/login?redirect=checkout');
  };

  if (!user && !isGuestCheckout) {
    return (
      <div className="min-h-screen py-20 px-4 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
        <div className="max-w-2xl mx-auto">
          <div className="glass rounded-3xl p-8 text-center">
            <h1 className="text-4xl font-bold text-white mb-6">Checkout</h1>
            <p className="text-xl text-slate-400 mb-8">Please sign in to complete your purchase</p>

            <div className="space-y-4">
              <button
                onClick={handleLoginCheckout}
                className="w-full btn-primary text-lg py-4"
              >
                Sign In & Continue
              </button>
              <button
                onClick={handleGuestCheckout}
                className="w-full btn-secondary text-lg py-4"
              >
                Continue as Guest
              </button>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-700">
              <p className="text-slate-400 mb-4">Don't have an account?</p>
              <Link to="/register" className="text-accent-400 hover:text-accent-300 font-semibold">
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showPayment) {
    return <PaymentForm cartItems={cartItems} total={total} onBack={() => setShowPayment(false)} />;
  }

  return (
    <div className="min-h-screen py-20 px-4 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link to="/shop" className="inline-flex items-center text-slate-400 hover:text-white transition-colors">
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Shop
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="space-y-6">
            <div className="glass rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-4 border-b border-slate-700">
                    <div>
                      <h3 className="font-semibold text-white">{item.name}</h3>
                      <p className="text-sm text-slate-400">Quantity: {item.quantity}</p>
                    </div>
                    <span className="font-bold text-accent-400">${item.price}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-slate-700 space-y-2">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-white pt-2 border-t border-slate-600">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4">
              <div className="glass p-4 rounded-2xl text-center">
                <ShieldCheckIcon className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <p className="text-xs text-slate-400">Secure Payment</p>
              </div>
              <div className="glass p-4 rounded-2xl text-center">
                <TruckIcon className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <p className="text-xs text-slate-400">Fast Delivery</p>
              </div>
              <div className="glass p-4 rounded-2xl text-center">
                <CreditCardIcon className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <p className="text-xs text-slate-400">Money Back</p>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="glass rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Shipping Information</h2>

            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">First Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-accent-500 focus:outline-none transition-colors"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Last Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-accent-500 focus:outline-none transition-colors"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-accent-500 focus:outline-none transition-colors"
                  placeholder="john@example.com"
                  defaultValue={user?.email || ''}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Address</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-accent-500 focus:outline-none transition-colors"
                  placeholder="123 Main St"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">City</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-accent-500 focus:outline-none transition-colors"
                    placeholder="New York"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">State</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-accent-500 focus:outline-none transition-colors"
                    placeholder="NY"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">ZIP</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-accent-500 focus:outline-none transition-colors"
                    placeholder="10001"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowPayment(true)}
                className="w-full btn-primary text-lg py-4 mt-8"
              >
                Continue to Payment
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;