import { Link } from 'react-router-dom';
import { HeartIcon, ShoppingCartIcon, StarIcon } from '@heroicons/react/24/outline';
import { useCart } from '../contexts/CartContext.jsx';


const ProductCard = ({ product }) => {
  const { addItem } = useCart();

  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/400x300/ef4444/f8fafc?text=Product';
  };

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent navigation to product detail
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: Array.isArray(product.images) && product.images.length ? product.images[0] : product.image,
    });
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="group block card p-6 hover:shadow-hover transition-all"
    >
      {/* Image */}
      <div className="relative mb-6 overflow-hidden rounded-xl">
        {(() => {
          const src = Array.isArray(product.images) && product.images.length ? product.images[0] : product.image;
          return (
            <img
              src={src}
              alt={product.name}
              onError={handleImageError}
              loading="lazy"
              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
            />
          );
        })()}

        {/* Hover overlay */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/50 via-black/20 to-transparent" />

        <button className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-neutral-800/90 hover:bg-white dark:hover:bg-neutral-700 rounded-full shadow-soft opacity-0 group-hover:opacity-100 transition-all">
          <HeartIcon className="w-5 h-5 text-gray-700 dark:text-gray-300 hover:text-red-500" />
        </button>
      </div>

      {/* Category Badge */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <span className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 text-xs font-medium rounded-full">
          {product.category}
        </span>

        {product.stock <= 10 ? (
          <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-rose-500/20 to-red-500/20 text-rose-300 dark:text-rose-200 text-xs font-mono rounded-full border border-rose-500/20">
            {product.stock === 0 ? 'Out' : `${product.stock} left`}
          </span>
        ) : (
          <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-200 dark:text-emerald-200 text-xs font-mono rounded-full border border-emerald-500/20">
            In stock
          </span>
        )}
      </div>

      {/* Name & Description */}
      <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
        {product.name}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">{product.description}</p>

      {/* Price & Rating */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-2xl font-bold text-neutral-900 dark:text-white">
            ${product.price}
          </span>
        </div>
        <span className="flex items-center text-sm text-gray-500 dark:text-gray-400 font-medium">
          <StarIcon className="w-4 h-4 text-amber-400 mr-1 fill-current" />
          4.9 (127)
        </span>
      </div>

      {/* Action Button */}
      <button
        onClick={handleAddToCart}
        className={`w-full btn-primary text-sm ${product.stock === 0 ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <ShoppingCartIcon className="w-4 h-4 inline mr-2" />
        {product.stock === 0 ? 'Unavailable' : 'Add to Cart'}
      </button>
    </Link>
  );
};

export default ProductCard;

