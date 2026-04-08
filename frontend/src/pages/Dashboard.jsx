import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { ShoppingBagIcon, ChartBarIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen py-20 px-4 bg-gradient-to-br from-slate-900 via-primary-900/30 to-accent-900/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white to-primary-400 bg-clip-text text-transparent mb-6">
            Dashboard
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Welcome back, <span className="font-bold text-accent-400">{user?.name || 'User'}</span>!
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div className="glass p-8 rounded-3xl text-center hover:scale-105 transition-all group">
            <ShoppingBagIcon className="w-20 h-20 text-primary-400 mx-auto mb-6 group-hover:rotate-6 transition-transform" />
            <h3 className="text-2xl font-bold text-white mb-4">Orders</h3>
            <p className="text-slate-400 text-lg mb-8">3 active orders</p>
            <Link to="/shop" className="btn-primary px-8 py-3">View Orders</Link>
          </div>

          <div className="glass p-8 rounded-3xl text-center hover:scale-105 transition-all group">
            <ChartBarIcon className="w-20 h-20 text-accent-400 mx-auto mb-6 group-hover:rotate-6 transition-transform" />
            <h3 className="text-2xl font-bold text-white mb-4">Analytics</h3>
            <p className="text-slate-400 text-lg mb-8">$1,234 total spent</p>
            <button className="bg-gradient-to-r from-accent-500 to-emerald-500 hover:from-accent-600 px-8 py-3 rounded-2xl font-bold text-white shadow-glow transition-all">View Stats</button>
          </div>

          <div className="glass p-8 rounded-3xl text-center hover:scale-105 transition-all group">
            <UserGroupIcon className="w-20 h-20 text-emerald-400 mx-auto mb-6 group-hover:rotate-6 transition-transform" />
            <h3 className="text-2xl font-bold text-white mb-4">Support</h3>
            <p className="text-slate-400 text-lg mb-8">24/7 priority support</p>
            <Link to="/contact" className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 px-8 py-3 rounded-2xl font-bold text-white shadow-glow transition-all">Contact Support</Link>
          </div>
        </div>

        <div className="text-center">
          <button 
            onClick={logout}
            className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 text-white font-bold py-4 px-12 rounded-2xl shadow-lg hover:shadow-glow transition-all duration-200 transform hover:scale-105"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

