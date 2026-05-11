import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useCart } from '../contexts/CartContext.jsx';
import ThemeToggle from '../theme/ThemeToggle.jsx';
import { ShoppingCartIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';


const Header = () => {
  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'AI Tools', path: '/shop/category/ai-tools' },
    { name: 'Software', path: '/shop/category/software' },
    { name: 'Dev Resources', path: '/shop/category/dev-resources' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-md border-b border-gray-200 dark:border-neutral-700 shadow-soft">
      {/* Top Bar */}
      <div className="bg-slate-100 dark:bg-neutral-800 border-b border-slate-200 dark:border-neutral-700">
        <div className="container py-2">
          <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
            <div className="flex space-x-6">
              <span>AI & Dev Tools</span>
              <Link to="/shop" className="hover:text-accent-400 transition-colors">Boutique</Link>
              <Link to="/contact" className="hover:text-accent-400 transition-colors">Contact</Link>
              {user ? (
                <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="hover:text-accent-400 transition-colors font-semibold">
                  {user.role === 'admin' ? 'Admin Dashboard' : 'Mon Espace'}
                </Link>
              ) : null}
            </div>
            <div className="flex space-x-4">
              {user ? (
                <>
                  <span>Bienvenue, {user.name}</span>
                  <button onClick={logout} className="hover:text-accent-400 transition-colors">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="hover:text-accent-400 transition-colors">Connexion</Link>
                  <Link to="/register" className="hover:text-accent-400 transition-colors">Inscription</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group font-heading">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white/90 dark:bg-neutral-900/60 border border-gray-200 dark:border-neutral-700 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-soft">
              <span className="text-primary-600 dark:text-primary-400 font-bold text-lg">S</span>
            </div>

            <div>
              <h1 className="text-xl lg:text-2xl xl:text-3xl font-bold text-neutral-900 dark:text-white">
                Smart Tech Store
              </h1>
              <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400 font-mono">AI • Software • Dev</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="px-3 lg:px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-neutral-700 rounded-xl transition-all duration-200 font-medium"
              >
                {item.name}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  to={user.role === 'admin' ? '/admin' : '/dashboard'}
                  className="px-3 lg:px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-neutral-700 rounded-xl transition-all duration-200 font-medium"
                >
                  {user.role === 'admin' ? 'Admin' : user.name}
                </Link>
                <button
                  onClick={logout}
                  className="px-3 lg:px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200 font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3 lg:px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-neutral-700 rounded-xl transition-all duration-200 font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-sm px-4 py-2"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>

          {/* Right Icons */}
          <div className="flex items-center space-x-2 lg:space-x-4">
            {user && (
              <Link
                to={user.role === 'admin' ? '/admin' : '/dashboard'}
                className="hidden md:inline-flex items-center px-4 py-2 rounded-2xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-all"
              >
                {user.role === 'admin' ? 'Admin Dashboard' : 'Mon Espace'}
              </Link>
            )}
            <ThemeToggle />
            <Link to="/checkout" className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-neutral-700 rounded-xl transition-all">
              <ShoppingCartIcon className="w-5 h-5 lg:w-6 lg:h-6" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {getTotalItems()}
                </span>
              )}
            </Link>
            
            {/* Mobile menu button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-neutral-700 text-gray-700 dark:text-gray-300"
            >
              {mobileMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-neutral-700 bg-white/95 dark:bg-neutral-800/95 backdrop-blur-md">
            <nav className="container py-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-neutral-700 rounded-xl transition-all duration-200 font-medium"
                >
                  {item.name}
                </Link>
              ))}
              {user ? (
                <>
                  <Link
                    to={user.role === 'admin' ? '/admin' : '/dashboard'}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-neutral-700 rounded-xl transition-all duration-200 font-medium"
                  >
                    {user.role === 'admin' ? 'Admin Dashboard' : 'Mon Espace'}
                  </Link>
                  <button
                    onClick={() => { logout(); setMobileMenuOpen(false); }}
                    className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200 font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-neutral-700 rounded-xl transition-all duration-200 font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn-primary text-sm px-4 py-2 block text-center"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

