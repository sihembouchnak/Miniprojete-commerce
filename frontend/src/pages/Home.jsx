import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { api } from '../utils/api.js';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [aiTools, setAiTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await api.getProducts();
        setFeaturedProducts(data.slice(0, 8));
        setAiTools(data.filter((p) => p.category === 'AI Tools').slice(0, 4));
      } catch (err) {
        setError(err.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading products...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="glass p-10 rounded-2xl border border-red-500/40 text-red-200">
          <h2 className="text-2xl font-bold mb-4">Erreur</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-content">
          <div className="animate-fade-in mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-slate-100 dark:text-slate-200 mb-6">
              <span className="w-2 h-2 rounded-full bg-primary-300" />
              Premium tools • Simple checkout • Fast discovery
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold bg-gradient-to-r from-white via-gray-100 to-primary-300 bg-clip-text text-transparent mb-6 leading-tight">
              Smart Tech Store
            </h1>

            <p className="text-lg md:text-xl lg:text-2xl text-slate-200/90 mb-8 max-w-2xl mx-auto font-body">
              Premium <span className="text-white font-semibold">AI Tools</span>,{' '}
              <span className="text-accent-200 font-semibold">Software</span> &{' '}
              <span className="text-emerald-200 font-semibold">Dev Resources</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/shop" className="btn-primary text-base md:text-lg px-10 py-4">
                Explore Store
              </Link>
              <Link to="/shop/category/ai-tools" className="btn-secondary text-base md:text-lg px-10 py-4">
                AI Tools
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding bg-white">
        <div className="container">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-heading font-bold bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent mb-6">
              💥 Why Choose Us?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-body">
              Premium tools for modern developers
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            <div className="group card p-8 hover:shadow-hover transition-all cursor-pointer">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-200 transition-all">
                💻
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-4 font-heading">Connected Tech</h3>
              <p className="text-gray-600 font-body">Built for developers and tech professionals.</p>
            </div>
            <div className="group card p-8 hover:shadow-hover transition-all cursor-pointer">
              <div className="w-16 h-16 bg-accent-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-accent-200 transition-all">
                🗄️
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-4 font-heading">Easy Database</h3>
              <p className="text-gray-600 font-body">Seamless integration & scaling.</p>
            </div>
            <div className="group card p-8 hover:shadow-hover transition-all cursor-pointer">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all">
                ✨
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-4 font-heading">Modern Design</h3>
              <p className="text-gray-600 font-body">Stunning UI/UX for real products.</p>
            </div>
            <div className="group card p-8 hover:shadow-hover transition-all cursor-pointer">
              <div className="w-16 h-16 bg-success-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-success-200 transition-all">
                🚀
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-4 font-heading">Startup Quality</h3>
              <p className="text-gray-600 font-body">Trusted by dev teams worldwide.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-padding bg-gray-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent mb-4">
              🔥 Featured Products
            </h2>
            <p className="text-xl text-gray-600 font-body">Handpicked tools for serious developers</p>
          </div>
          <div className="product-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-16">
            <Link to="/shop" className="btn-primary text-lg px-12 py-4">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-primary-600/20 to-accent-500/20">
        <div className="container text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Supercharge Your Dev Workflow?</h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">Join thousands of developers using Smart Tech Store tools.</p>
          <Link to="/shop" className="btn-primary text-xl px-12 py-5 inline-block transform hover:scale-105">
            Start Shopping Now
          </Link>
        </div>
      </section>

      {/* Dashboard Access */}
      <section className="section-padding bg-slate-950 text-white">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-500/15 text-emerald-300 mb-4">Admin & Dashboard</span>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Accédez au tableau de bord</h2>
              <p className="text-lg text-slate-300 mb-8 max-w-2xl">
                Le dashboard est disponible pour les utilisateurs connectés. Si vous êtes administrateur, utilisez <strong>admin@smartstore.com</strong> / <strong>admin123</strong> pour accéder au panneau d’administration.
              </p>
              <Link
                to={user ? (user.role === 'admin' ? '/admin' : '/dashboard') : '/login'}
                className="btn-primary text-lg px-10 py-4"
              >
                {user ? (user.role === 'admin' ? 'Aller au Admin Dashboard' : 'Aller à Mon Espace') : 'Se connecter pour voir le dashboard'}
              </Link>
            </div>
            <div className="glass p-8 rounded-3xl border border-white/10 shadow-soft">
              <h3 className="text-2xl font-bold text-white mb-4">Tableau de bord</h3>
              <ul className="space-y-4 text-slate-300">
                <li>• Gestion des produits</li>
                <li>• Gestion des utilisateurs</li>
                <li>• Consultation des messages clients</li>
                <li>• Statistiques de vente et suivi</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

