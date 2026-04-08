import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircleIcon, ShoppingBagIcon, HomeIcon } from '@heroicons/react/24/outline';

const PaymentSuccess = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-900 via-emerald-900/20 to-slate-900">
      <div className="glass rounded-3xl p-12 text-center max-w-lg mx-auto">
        <CheckCircleIcon className="w-24 h-24 text-emerald-400 mx-auto mb-6 animate-pulse" />
        <h1 className="text-4xl font-bold text-white mb-4">Payment Successful!</h1>
        <p className="text-xl text-slate-400 mb-8">
          Thank you for your purchase! Your order has been confirmed and you'll receive an email with the download links shortly.
        </p>

        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 mb-8">
          <h3 className="text-lg font-bold text-emerald-400 mb-2">Order Details</h3>
          <p className="text-slate-300">Order #12345</p>
          <p className="text-slate-300">Total: $29.98</p>
        </div>

        <div className="space-y-4">
          <Link to="/dashboard" className="w-full btn-primary inline-flex items-center justify-center">
            <ShoppingBagIcon className="w-5 h-5 mr-2" />
            View My Orders
          </Link>
          <Link to="/" className="w-full btn-secondary inline-flex items-center justify-center">
            <HomeIcon className="w-5 h-5 mr-2" />
            Continue Shopping
          </Link>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-700">
          <p className="text-sm text-slate-400">
            Need help? <Link to="/contact" className="text-accent-400 hover:text-accent-300">Contact Support</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;