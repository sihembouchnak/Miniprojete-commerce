import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { PlusIcon, PencilIcon, TrashIcon, ChartBarIcon, UsersIcon, ShoppingBagIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState([
    { name: 'Total Sales', value: '$12,345', change: '+12%', color: 'emerald', icon: ShoppingBagIcon },
    { name: 'Active Users', value: '1,247', change: '+8%', color: 'blue', icon: UsersIcon },
    { name: 'Revenue', value: '$23,891', change: '+23%', color: 'purple', icon: CurrencyDollarIcon },
    { name: 'Conversion Rate', value: '3.2%', change: '+0.5%', color: 'cyan', icon: ChartBarIcon },
  ]);

  const colorStyles = {
    emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
    blue: { bg: 'bg-blue-500/10', text: 'text-blue-400' },
    purple: { bg: 'bg-purple-500/10', text: 'text-purple-400' },
    cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-400' },
  };

  const [products, setProducts] = useState([
    { id: 1, name: 'AI Resume Builder', price: '$9.99', sales: 127, status: 'active' },
    { id: 2, name: 'Code Autocompletion Pro', price: '$49.99', sales: 89, status: 'active' },
    { id: 3, name: 'React Boilerplate', price: '$39.99', sales: 203, status: 'active' },
  ]);

  const [recentOrders, setRecentOrders] = useState([
    { id: '#1234', customer: 'John Doe', product: 'AI Resume Builder', amount: '$9.99', status: 'completed' },
    { id: '#1235', customer: 'Jane Smith', product: 'Code Autocompletion Pro', amount: '$49.99', status: 'pending' },
    { id: '#1236', customer: 'Bob Johnson', product: 'React Boilerplate', amount: '$39.99', status: 'completed' },
  ]);

  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    window.clearTimeout(window.toastTimeout);
    window.toastTimeout = window.setTimeout(() => setToast(null), 3500);
  };

  const handleAddProduct = () => {
    const nextId = products.length ? Math.max(...products.map((p) => p.id)) + 1 : 1;
    const newProduct = {
      id: nextId,
      name: `New Product ${nextId}`,
      price: '$29.99',
      sales: 0,
      status: 'active',
    };
    setProducts((prev) => [newProduct, ...prev]);
    showToast('Produit ajouté avec succès !');
  };

  const handleEditProduct = (id) => {
    setProducts((prev) => prev.map((product) =>
      product.id === id
        ? { ...product, name: `${product.name} (modifié)`, status: product.status === 'active' ? 'active' : 'active' }
        : product
    ));
    showToast('Produit modifié avec succès !');
  };

  const handleDeleteProduct = (id) => {
    setProducts((prev) => prev.filter((product) => product.id !== id));
    showToast('Produit supprimé avec succès !');
  };

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => prev.map((stat) => ({
        ...stat,
        value: stat.name === 'Total Sales' ? `$${Math.floor(Math.random() * 1000) + 12000}` : stat.value,
      })));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen py-20 px-4 bg-gradient-to-br from-slate-900 via-indigo-900/30 to-purple-900/20">
      <div className="max-w-7xl mx-auto">
        {toast && (
          <div className="glass border border-emerald-500/20 p-4 rounded-3xl mb-8 shadow-glow-lg">
            <p className="text-white font-semibold">{toast.message}</p>
          </div>
        )}

        <div className="mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-cyan-200 to-purple-400 bg-clip-text text-transparent mb-4 animate-pulse">
            🚀 Admin Dashboard
          </h1>
          <p className="text-xl text-slate-400">Welcome back, {user?.name}! Voici votre espace de gestion.</p>
        </div>

        {/* Dynamic Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const style = colorStyles[stat.color] || colorStyles.emerald;
            return (
              <div key={index} className="glass p-6 rounded-3xl group hover:scale-105 transition-all hover:shadow-glow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-2xl ${style.bg}`}>
                    <Icon className={`w-8 h-8 ${style.text}`} />
                  </div>
                  <span className={`text-sm font-bold ${style.text}`}>{stat.change}</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
                <p className="text-slate-400 text-sm">{stat.name}</p>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Products Management */}
          <div className="glass rounded-3xl p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-white">📦 Products</h2>
              <button
                onClick={handleAddProduct}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-3 px-6 rounded-2xl shadow-glow-lg hover:shadow-glow-xl transition-all flex items-center space-x-2 transform hover:scale-105"
              >
                <PlusIcon className="w-5 h-5" />
                <span>Add Product</span>
              </button>
            </div>

            <div className="space-y-4">
              {products.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-2xl hover:bg-slate-800/70 transition-all">
                  <div>
                    <h3 className="font-bold text-white">{product.name}</h3>
                    <p className="text-sm text-slate-400">{product.price} • {product.sales} ventes</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${product.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                      {product.status}
                    </span>
                    <button
                      onClick={() => handleEditProduct(product.id)}
                      className="p-2 text-emerald-400 hover:bg-emerald-500/20 rounded-xl transition-all"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="p-2 text-red-400 hover:bg-red-500/20 rounded-xl transition-all"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="glass rounded-3xl p-8">
            <h2 className="text-3xl font-bold text-white mb-8">📋 Recent Orders</h2>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-2xl hover:bg-slate-800/70 transition-all">
                  <div>
                    <h3 className="font-bold text-white">{order.id}</h3>
                    <p className="text-sm text-slate-400">{order.customer} • {order.product}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-emerald-400">{order.amount}</p>
                    <span className={`px-2 py-1 rounded-full text-xs ${order.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass rounded-3xl p-8">
          <h2 className="text-3xl font-bold text-white mb-8">⚡ Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <button className="p-6 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30 rounded-2xl border border-blue-500/30 hover:border-blue-500/50 transition-all group">
              <ChartBarIcon className="w-12 h-12 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-white mb-2">View Analytics</h3>
              <p className="text-slate-400 text-sm">Detailed sales and user insights</p>
            </button>
            <button className="p-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 rounded-2xl border border-purple-500/30 hover:border-purple-500/50 transition-all group">
              <UsersIcon className="w-12 h-12 text-purple-400 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-white mb-2">Manage Users</h3>
              <p className="text-slate-400 text-sm">User accounts and permissions</p>
            </button>
            <button className="p-6 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 rounded-2xl border border-emerald-500/30 hover:border-emerald-500/50 transition-all group">
              <ShoppingBagIcon className="w-12 h-12 text-emerald-400 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-white mb-2">Inventory</h3>
              <p className="text-slate-400 text-sm">Stock levels and alerts</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

