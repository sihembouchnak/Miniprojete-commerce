import { Link } from 'react-router-dom';
import { HeartIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';

const ProductCard = ({ product }) => {
  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/400x225/1e293b/64748b?text=Product+Image';
  };

  return (
    <Link to={`/product/${product.id}`} className="group block p-6 glass rounded-2xl hover:shadow-glow-lg product-hover overflow-hidden border border-slate-700/50">
      {/* Image */}
      <div className="relative mb-6 aspect-video bg-slate-800/50 rounded-xl overflow-hidden group-hover:scale-110 transition-transform duration-500">
        <img 
          src={product.image} 
          alt={product.name}
          onError={handleImageError}
          className="w-full h-full object-cover group-hover:brightness-110 transition-all"
        />
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all p-2 bg-white/10 backdrop-blur rounded-xl">
          <HeartIcon className="w-5 h-5 text-slate-300 hover:text-red-400 transition-colors" />
        </div>
      </div>

      {/* Category Badge */}
      <span className="inline-block px-3 py-1 bg-gradient-to-r from-primary-500/20 to-accent-500/20 text-xs font-mono text-primary-400 rounded-full mb-3">
        {product.category}
      </span>

      {/* Name & Description */}
      <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-accent-400 transition-colors">
        {product.name}
      </h3>
      <p className="text-slate-400 text-sm mb-4 line-clamp-2">{product.description}</p>

      {/* Price & Stock */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-2xl font-bold text-white">${product.price}</span>
          {product.stock < 10 && (
            <span className="ml-2 px-2 py-1 bg-rose-500/20 text-rose-400 text-xs rounded-full font-mono">
              Low Stock
            </span>
          )}
        </div>
        <span className="flex items-center text-sm text-slate-500">
          <StarIcon className="w-4 h-4 text-amber-400 mr-1" />
          4.9 (127)
        </span>
      </div>

      {/* Action Button */}
      <button className="w-full btn-primary py-3 rounded-xl font-semibold transform hover:scale-102 transition-all shadow-glow">
        <ShoppingCartIcon className="w-5 h-5 inline mr-2" />
        Add to Cart
      </button>

      {/* Stock Indicator */}
      {product.stock === 0 ? (
        <div className="mt-3 text-center py-2 bg-rose-500/20 text-rose-400 text-xs rounded-xl font-mono">
          Out of Stock
        </div>
      ) : (
        <div className="mt-2 text-center text-xs text-slate-500 font-mono">
          {product.stock} in stock
        </div>
      )}
    </Link>
  );
};

export default ProductCard;

