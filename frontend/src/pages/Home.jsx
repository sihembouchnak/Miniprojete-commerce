import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import { api } from '../utils/api.js';
import { products as localProducts } from '../data/products.js';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [aiTools, setAiTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await api.getProducts();
      setFeaturedProducts(data.slice(0, 8));
      setAiTools(data.filter((p) => p.category === 'AI Tools').slice(0, 4));
    } catch (err) {
      console.log('API failed, using local data:', err.message);
      // Fallback to local data
      setFeaturedProducts(localProducts.slice(0, 8));
      setAiTools(localProducts.filter((p) => p.category === 'AI Tools').slice(0, 4));
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
          <div className="hero-glow mb-8">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-white via-slate-100 to-accent-400 bg-clip-text text-transparent mb-6 leading-tight">
              Smart Tech Store
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-2xl mx-auto font-mono">
              🚀 Premium <span className="text-accent-400">AI Tools</span>, <span className="text-primary-400">Software</span> & <span className="text-cyan-400">Dev Resources</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/shop" className="btn-primary text-lg px-8 py-4">
                Explore Store
              </Link>
              <Link to="/shop/category/ai-tools" className="btn-secondary text-lg px-8 py-4">
                AI Tools First
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Strong Section */}
      <section className="section-padding bg-slate-900/50">
        <div className="container">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent mb-6">
              💥 Why Smart Tech Store?
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Powering the next generation of developers with cutting-edge tools.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-8 glass rounded-2xl hover:scale-105 transition-all group">
              <div className="w-20 h-20 bg-primary-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-500/40 transition-all">
                💻
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Informatique Connected</h3>
              <p className="text-slate-400">Everything built for modern developers and tech professionals.</p>
            </div>
            <div className="text-center p-8 glass rounded-2xl hover:scale-105 transition-all group">
              <div className="w-20 h-20 bg-accent-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-accent-500/40 transition-all">
                🗄️
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Easy Database</h3>
              <p className="text-slate-400">Structured data ready for seamless integration and scaling.</p>
            </div>
            <div className="text-center p-8 glass rounded-2xl hover:scale-105 transition-all group">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all">
                ✨
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Imagination Presentation</h3>
              <p className="text-slate-400">Stunning UI/UX that looks like a real startup product.</p>
            </div>
            <div className="text-center p-8 glass rounded-2xl hover:scale-105 transition-all group">
              <div className="w-20 h-20 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-emerald-500/40 transition-all">
                🚀
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Real Startup Feel</h3>
              <p className="text-slate-400">Professional quality tools trusted by development teams worldwide.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-padding">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent mb-4">
              🔥 Featured Products
            </h2>
            <p className="text-xl text-slate-400">Handpicked tools for serious developers</p>
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
    </div>
  );
};

export default Home;

