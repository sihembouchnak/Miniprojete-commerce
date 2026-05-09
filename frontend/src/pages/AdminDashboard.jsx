import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { api } from '../utils/api.js';
import {
  ChartBarIcon,
  ShoppingBagIcon,
  UserIcon,
  CogIcon,
  DocumentPlusIcon,
  InboxIcon,
  ArrowTrendingUpIcon,
  SparklesIcon,
  TrashIcon,
  PencilSquareIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    users: 0,
    products: 0,
    messages: 0
  });
  const [latestMessages, setLatestMessages] = useState([]);
  const [latestProducts, setLatestProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError('');

      try {
        const [productsRes, usersRes, messagesRes] = await Promise.all([
          api.getProducts(),
          api.getUsers(),
          api.getMessages()
        ]);

        const productData = productsRes.data || [];
        const messageData = messagesRes.data || [];

        setStats({
          revenue: 12450,
          orders: 1234,
          users: usersRes.data.length,
          products: productData.length,
          messages: messageData.length
        });

        setLatestProducts(productData.slice(0, 4));
        setLatestMessages(messageData.slice(0, 4));
      } catch (error) {
        console.error('Error fetching admin stats:', error);
        setError('Impossible de charger les données. Réessayez plus tard.');
        setStats({
          revenue: 12450,
          orders: 1234,
          users: 5678,
          products: 156,
          messages: 12
        });
        setLatestProducts([]);
        setLatestMessages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleDeleteProduct = async (product) => {
    const id = product._id || product.id;
    const confirmed = window.confirm(`Supprimer le produit « ${product.name} » ?`);
    if (!confirmed) return;

    try {
      await api.deleteProduct(id);
      setLatestProducts((prev) => prev.filter((item) => (item._id || item.id) !== id));
      setStats((prev) => ({ ...prev, products: Math.max(0, prev.products - 1) }));
    } catch (deleteError) {
      setError(deleteError?.message || 'Impossible de supprimer le produit');
    }
  };

  const handleMarkAsRead = async (message) => {
    const id = message._id || message.id;
    if (message.read) return;

    try {
      await api.markMessageAsRead(id);
      setLatestMessages((prev) => prev.map((item) =>
        (item._id || item.id) === id ? { ...item, read: true } : item
      ));
    } catch (markError) {
      setError(markError?.message || 'Impossible de marquer le message comme lu');
    }
  };

  const renderedMessages = (() => {
    if (loading) {
      return (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-24 rounded-3xl bg-slate-900/60" />
          ))}
        </div>
      );
    }

    if (latestMessages.length > 0) {
      return latestMessages.map((message) => (
        <div key={message._id || message.id || message.email || message.name} className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="font-semibold text-white">{message.subject || message.name || message.email || 'Nouveau contact'}</p>
              <p className="mt-1 text-sm text-slate-400 line-clamp-2">{message.message || message.body || 'Aucun message spécifique fourni.'}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                {message.read ? 'Lu' : 'Nouveau'}
              </span>
              {!message.read && (
                <button
                  type="button"
                  onClick={() => handleMarkAsRead(message)}
                  className="inline-flex items-center gap-2 rounded-2xl bg-white/5 px-3 py-2 text-xs text-slate-200 hover:bg-white/10 transition"
                >
                  <EyeIcon className="w-4 h-4" />
                  Marquer lu
                </button>
              )}
            </div>
          </div>
        </div>
      ));
    }

    return (
      <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 text-center text-slate-400">
        Aucun message récent trouvé. Vérifiez la page Messages pour plus de détails.
      </div>
    );
  })();

  const renderedProducts = (() => {
    if (loading) {
      return (
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-20 rounded-3xl bg-slate-900/60" />
          ))}
        </div>
      );
    }

    if (latestProducts.length > 0) {
      return (
        <div className="space-y-4">
          {latestProducts.map((product) => {
            const id = product._id || product.id;
            return (
              <div key={id} className="rounded-3xl border border-white/10 bg-slate-950/80 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-semibold text-white truncate">{product.name}</p>
                    <p className="text-sm text-slate-400 truncate">{product.category || 'Catégorie indisponible'}</p>
                    <p className="text-sm text-slate-400">€{Number(product.price || 0).toFixed(2)}</p>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      to="/admin/products"
                      className="inline-flex items-center gap-2 rounded-2xl bg-white/5 px-3 py-2 text-xs text-slate-200 hover:bg-white/10 transition"
                    >
                      <PencilSquareIcon className="w-4 h-4" />
                      Modifier
                    </Link>
                    <button
                      onClick={() => handleDeleteProduct(product)}
                      className="inline-flex items-center gap-2 rounded-2xl bg-red-500/10 px-3 py-2 text-xs text-red-300 hover:bg-red-500/20 transition"
                    >
                      <TrashIcon className="w-4 h-4" />
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    return (
      <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 text-center text-slate-400">
        Aucun produit récent trouvé. Ajoutez-en un depuis la page Produits.
      </div>
    );
  })();

  return (
    <div className="min-h-screen py-20 px-4 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto">
        {error && (
          <div className="mb-6 rounded-3xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
            {error}
          </div>
        )}
        <div className="mb-12 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="uppercase tracking-[0.35em] text-sm text-emerald-300/80 mb-3">Administration</p>
            <h1 className="text-5xl md:text-6xl font-black tracking-tight text-white">
              Tableau de bord Admin
            </h1>
            <p className="mt-4 text-lg text-slate-300 max-w-2xl">
              Bienvenue, <span className="font-semibold text-emerald-300">{user?.name || 'Admin'}</span>. Suivez les performances du site et accédez rapidement aux sections clés.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Link to="/admin/products" className="glass p-4 rounded-3xl flex flex-col items-center justify-center text-center hover:bg-white/10 transition-all">
              <CogIcon className="w-8 h-8 text-primary-300 mb-3" />
              <span className="font-semibold text-sm">Produits</span>
            </Link>
            <Link to="/admin/users" className="glass p-4 rounded-3xl flex flex-col items-center justify-center text-center hover:bg-white/10 transition-all">
              <UserIcon className="w-8 h-8 text-violet-300 mb-3" />
              <span className="font-semibold text-sm">Utilisateurs</span>
            </Link>
            <Link to="/admin/messages" className="glass p-4 rounded-3xl flex flex-col items-center justify-center text-center hover:bg-white/10 transition-all">
              <InboxIcon className="w-8 h-8 text-cyan-300 mb-3" />
              <span className="font-semibold text-sm">Messages</span>
            </Link>
            <button
              onClick={logout}
              className="glass p-4 rounded-3xl flex flex-col items-center justify-center text-center hover:bg-white/10 transition-all"
            >
              <SparklesIcon className="w-8 h-8 text-amber-300 mb-3" />
              <span className="font-semibold text-sm">Déconnexion</span>
            </button>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-2">
            {[
              {
                title: 'Chiffre d’affaires',
                value: `€${stats.revenue.toLocaleString()}`,
                hint: '+24% ce mois',
                icon: ChartBarIcon,
                color: 'text-emerald-300'
              },
              {
                title: 'Commandes',
                value: stats.orders.toLocaleString(),
                hint: '+18% cette semaine',
                icon: ShoppingBagIcon,
                color: 'text-sky-300'
              },
              {
                title: 'Utilisateurs',
                value: stats.users.toLocaleString(),
                hint: '+12% ce mois',
                icon: UserIcon,
                color: 'text-violet-300'
              },
              {
                title: 'Produits',
                value: stats.products.toLocaleString(),
                hint: 'Annonces actives',
                icon: DocumentPlusIcon,
                color: 'text-orange-300'
              }
            ].map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.title} className="glass p-8 rounded-3xl border border-white/10 shadow-xl shadow-slate-900/20 hover:-translate-y-1 transition-transform">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <p className="text-sm uppercase tracking-[0.24em] text-slate-400">{card.title}</p>
                      <p className="mt-4 text-4xl font-bold text-white">{card.value}</p>
                    </div>
                    <div className={`flex h-14 w-14 items-center justify-center rounded-3xl bg-white/10 ${card.color}`}>
                      <Icon className="w-7 h-7" />
                    </div>
                  </div>
                  <p className="text-sm text-slate-400">{card.hint}</p>
                </div>
              );
            })}
          </div>

          <div className="glass rounded-3xl border border-white/10 p-8 shadow-xl shadow-slate-900/20">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Activité récente</p>
                <h2 className="mt-3 text-2xl font-bold text-white">Derniers messages</h2>
              </div>
              <Link to="/admin/messages" className="text-sm font-semibold text-primary-300 hover:text-white transition-colors">
                Voir tout
              </Link>
            </div>

            <div className="space-y-4">{renderedMessages}</div>

            <div className="mt-8 rounded-3xl bg-slate-900/80 p-6 border border-white/10">
              <div className="flex items-center gap-3 text-slate-300">
                <ArrowTrendingUpIcon className="w-6 h-6 text-emerald-300" />
                <div>
                  <p className="text-sm font-semibold text-white">Performance rapide</p>
                  <p className="text-sm text-slate-400">Croissance stable des utilisateurs et des ventes cette semaine.</p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {[
                  { label: 'Engagement utilisateurs', value: 82 },
                  { label: 'Conversion produits', value: 69 },
                  { label: 'Réponse support', value: 95 }
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-sm text-slate-400 mb-2">
                      <span>{item.label}</span>
                      <span>{item.value}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-primary-500 to-cyan-400" style={{ width: `${item.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
          <div className="glass rounded-3xl border border-white/10 p-8 shadow-xl shadow-slate-900/20">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Produits récents</p>
                <h2 className="text-2xl font-bold text-white">Gérez rapidement vos produits</h2>
              </div>
              <Link to="/admin/products" className="text-sm font-semibold text-primary-300 hover:text-white transition-colors">
                Voir tout
              </Link>
            </div>

            <div className="space-y-4">{renderedProducts}</div>
          </div>

          <div className="glass rounded-3xl border border-white/10 p-8 shadow-xl shadow-slate-900/20">
            <h3 className="text-xl font-semibold text-white mb-4">Actions rapides</h3>
            <div className="space-y-3">
              <Link to="/admin/products" className="block rounded-2xl bg-slate-900/80 px-5 py-4 text-sm text-slate-200 hover:bg-slate-800 transition">
                + Ajouter un produit
              </Link>
              <Link to="/admin/products" className="block rounded-2xl bg-slate-900/80 px-5 py-4 text-sm text-slate-200 hover:bg-slate-800 transition">
                Modifier un produit existant
              </Link>
              <Link to="/admin/messages" className="block rounded-2xl bg-slate-900/80 px-5 py-4 text-sm text-slate-200 hover:bg-slate-800 transition">
                Lire les messages clients
              </Link>
              <Link to="/admin/users" className="block rounded-2xl bg-slate-900/80 px-5 py-4 text-sm text-slate-200 hover:bg-slate-800 transition">
                Gérer les utilisateurs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

