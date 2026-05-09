import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeftIcon, ShoppingCartIcon, HeartIcon, StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import ProductCard from '../components/ProductCard.jsx';
import { api } from '../utils/api.js';

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
        setError(err.message || 'Product not found');
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
        console.error('Unable to load related products', err);
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

  const imageUrls = (() => {
    if (Array.isArray(product.images) && product.images.length) return product.images;
    if (product.image) return [product.image];
    return [];
  })();

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [id]);

  const activeSrc = imageUrls[activeImageIndex] || imageUrls[0];

  const handleMainImageError = (e) => {
    // Fallback if the chosen image is broken
    if (activeImageIndex !== 0 && imageUrls.length > 1) {
      setActiveImageIndex(0);
      return;
    }
    e.target.src = 'https://via.placeholder.com/1200x800/0f172a/f8fafc?text=No+Image';
  };

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
            <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden shadow-2xl relative">
              {activeSrc ? (
                <img
                  src={activeSrc}
                  alt={product.name}
                  onError={handleMainImageError}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-slate-400 font-mono">No image</span>
                </div>
              )}

              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
            </div>

            {imageUrls.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {imageUrls.slice(0, 4).map((src, idx) => {
                  const isActive = idx === activeImageIndex;
                  return (
                    <button
                      key={src + idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative overflow-hidden rounded-xl border transition-all ${
                        isActive
                          ? 'border-primary-500/60 shadow-soft ring-2 ring-primary-500/20'
                          : 'border-slate-700/50 hover:border-slate-500/60'
                      }`}
                    >
                      <img
                        src={src}
                        alt={`${product.name} thumbnail ${idx + 1}`}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/200x150/0f172a/f8fafc?text=Img';
                        }}
                        className="w-full h-20 object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="glass p-8 rounded-2xl border border-slate-700/50 lg:max-w-lg">
            <div className="flex items-center justify-between mb-4 gap-4">
              <span className="px-3 py-1 bg-gradient-to-r from-primary-500/30 to-accent-500/30 text-primary-400 text-sm font-mono rounded-full">
                {product.category}
              </span>
              <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-mono">
                SKU-{product.id}
              </span>
            </div>

            <h1 className="text-4xl font-bold text-white mb-6 leading-tight">{product.name}</h1>

            <div className="flex items-center mb-8">
              <div className="flex">
                {[1, 2, 3, 4].map((star) => (
                  <StarSolid key={star} className="w-6 h-6 text-amber-400" />
                ))}
                <StarIcon className="w-6 h-6 text-slate-600 ml-1" />
              </div>
              <span className="ml-3 text-slate-400 font-mono">(247 reviews)</span>
            </div>

            <div className="mb-6">
              <span className="text-4xl font-bold text-white">${product.price}</span>
              {product.stock <= 10 ? (
                <span className="ml-4 px-3 py-1 bg-gradient-to-r from-rose-500/30 to-red-500/30 text-rose-400 text-sm font-mono rounded-full">
                  {product.stock === 0 ? 'Out of stock' : `${product.stock} left!`}
                </span>
              ) : (
                <span className="ml-4 px-3 py-1 bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-300 text-sm font-mono rounded-full">
                  In stock
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
              <Link
                to={product.stock === 0 ? '#' : '/checkout'}
                onClick={(e) => {
                  if (product.stock === 0) e.preventDefault();
                }}
                className={`flex-1 btn-primary py-4 px-6 font-semibold text-lg shadow-glow-lg hover:shadow-glow text-center ${
                  product.stock === 0 ? 'opacity-50 pointer-events-none' : ''
                }`}
              >
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



