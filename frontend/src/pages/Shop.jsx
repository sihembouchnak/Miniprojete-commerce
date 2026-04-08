import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import { FunnelIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { api } from '../utils/api.js';

const slugToCategory = (slug) => {
  if (!slug) return 'all';
  return slug.replace(/-/g, ' ');
};

const categoryToSlug = (category) => category.toLowerCase().replace(/\s+/g, '-');

const Shop = () => {
  const { category: categoryParam } = useParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['all']);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const productsPerPage = 12;

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesFromApi = await api.getCategories();
        setCategories(['all', ...categoriesFromApi]);
      } catch (err) {
        console.error('Unable to load categories', err);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    if (!categoryParam) {
      setSelectedCategory('all');
      return;
    }

    const candidate = slugToCategory(categoryParam);
    const matched = categories.find((cat) => categoryToSlug(cat) === categoryParam.toLowerCase());
    setSelectedCategory(matched || candidate);
  }, [categoryParam, categories]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const filters = {};
        if (selectedCategory && selectedCategory !== 'all') {
          filters.category = selectedCategory;
        }
        if (searchTerm) {
          filters.search = searchTerm;
        }

        const { data } = await api.getProducts(filters);
        setProducts(data);
        setCurrentPage(1);
      } catch (err) {
        setError(err.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, searchTerm]);

  const paginatedProducts = products.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const totalPages = Math.max(1, Math.ceil(products.length / productsPerPage));

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
    <div className="min-h-screen py-12">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent mb-4">
            Tech Store
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Discover premium AI tools, software, and developer resources
          </p>
        </div>

        {/* Filters */}
        <div className="glass p-8 rounded-2xl mb-12 border border-slate-700/50">
          <div className="flex flex-col lg:flex-row gap-8 items-center justify-between">
            {/* Search */}
            <div className="relative w-full lg:w-80">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-surface/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:border-primary-500 focus:outline-none transition-all"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <FunnelIcon className="w-6 h-6 text-slate-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-surface/50 border border-slate-600/50 text-white px-4 py-3 rounded-xl focus:border-primary-500 focus:outline-none"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat.toUpperCase()}</option>
                ))}
              </select>
            </div>

            {/* Results Info */}
            <div className="text-slate-400 font-mono">
              {products.length} products found
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {paginatedProducts.length > 0 ? (
          <>
            <div className="product-grid mb-12">
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-xl font-mono transition-all ${
                    currentPage === page
                      ? 'bg-primary-500 text-white shadow-glow'
                      : 'bg-surface/50 text-slate-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-32">
            <MagnifyingGlassIcon className="w-16 h-16 text-slate-600 mx-auto mb-8 opacity-50" />
            <h3 className="text-2xl font-bold text-slate-400 mb-4">No products found</h3>
            <Link to="/shop" className="btn-secondary">Clear filters</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;

