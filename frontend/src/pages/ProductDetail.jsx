import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeftIcon, ShoppingCartIcon, HeartIcon, StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import ProductCard from '../components/ProductCard.jsx';
import { api } from '../utils/api.js';
import { products as localProducts } from '../data/products.js';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const productData = await api.getProduct(id);
        setProduct(productData);
      } catch (err) {
        console.log('API failed, using local data:', err.message);
        // Fallback to local data
        const productData = localProducts.find(p => p.id == id);
        if (productData) {
          setProduct(productData);
        } else {
          setError('Product not found');
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  useEffect(() => {
    const loadRelated = async () => {
      if (!product) return;
      try {
        const { data } = await api.getProducts({ category: product.category });
        setRelatedProducts(data.filter((p) => p.id !== product.id).slice(0, 4));
      } catch (err) {
        console.log('Related API failed, using local data');
        const related = localProducts.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
        setRelatedProducts(related);
      }
    };

    loadRelated();
  }, [product]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading product...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen py-20 flex items-center justify-center">
        <div className="text-center glass p-12 rounded-2xl max-w-md mx-auto">
          <h1 className="text-4xl font-bold text-slate-400 mb-6">Product Not Found</h1>
          <p className="text-slate-400 mb-6">{error || 'This product cannot be loaded.'}</p>
          <Link to="/shop" className="btn-primary">Back to Shop</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="glass p-4 rounded-xl mb-12 border border-slate-700/50 max-w-2xl">
          <Link to="/shop" className="flex items-center text-slate-400 hover:text-white transition-colors">
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Shop
          </Link>
        </nav>

        {/* Product Main */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden shadow-2xl">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
            </div>
          </div>

          {/* Product Info */}
          <div className="glass p-8 rounded-2xl border border-slate-700/50 lg:max-w-lg">
            <div className="flex items-center mb-4">
              <span className="px-3 py-1 bg-gradient-to-r from-primary-500/30 to-accent-500/30 text-primary-400 text-sm font-mono rounded-full">
                {product.category}
              </span>
            </div>
            
            <h1 className="text-4xl font-bold text-white mb-6 leading-tight">{product.name}</h1>
            
            <div className="flex items-center mb-8">
              <div className="flex">
                {[1,2,3,4].map((star) => (
                  <StarSolid key={star} className="w-6 h-6 text-amber-400" />
                ))}
                <StarIcon className="w-6 h-6 text-slate-600 ml-1" />
              </div>
              <span className="ml-3 text-slate-400 font-mono">(247 reviews)</span>
            </div>

            <div className="mb-8">
              <span className="text-4xl font-bold text-white">${product.price}</span>
              {product.stock < 10 && (
                <span className="ml-4 px-3 py-1 bg-gradient-to-r from-rose-500/30 to-red-500/30 text-rose-400 text-sm font-mono rounded-full">
                  Only {product.stock} left!
                </span>
              )}
            </div>

            <p className="text-slate-400 text-lg mb-8 leading-relaxed">{product.description}</p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center text-sm">
                <span className="w-32 text-slate-500 font-mono">Stock:</span>
                <span className="font-semibold text-white">{product.stock}</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="w-32 text-slate-500 font-mono">Category:</span>
                <span className="text-accent-400 font-mono">{product.category}</span>
              </div>
            </div>

            <div className="flex gap-4">
              <Link to="/checkout" className="flex-1 btn-primary py-4 px-6 font-semibold text-lg shadow-glow-lg hover:shadow-glow text-center">
                <ShoppingCartIcon className="w-6 h-6 mr-2 inline" />
                Buy Now
              </Link>
              <button className="p-4 bg-white/10 hover:bg-white/20 text-slate-300 rounded-xl transition-all hover:scale-105">
                <HeartIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold text-white mb-12 text-center">
              Related {product.category}
            </h2>
            <div className="product-grid">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;



