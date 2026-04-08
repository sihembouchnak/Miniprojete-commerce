import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import ThemeToggle from '../theme/ThemeToggle.jsx';
import { ShoppingCartIcon, Bars3Icon, XMarkIcon, SparklesIcon } from '@heroicons/react/24/outline';

const Header = () => {
  const { user, logout } = useAuth();
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'AI Tools', path: '/shop/category/ai-tools' },
    { name: 'Software', path: '/shop/category/software' },
    { name: 'Dev Resources', path: '/shop/category/dev-resources' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 glass shadow-glow-lg border-b border-slate-700/50">
      <div className="container">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center shadow-glow animate-pulse-glow">
              <SparklesIcon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
                Smart Tech Store
              </h1>
              <p className="text-xs md:text-sm text-accent-400 font-mono tracking-wider">AI • Software • Dev</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="px-4 py-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 font-medium hover:scale-105"
              >
                {item.name}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  to={user.role === 'admin' ? '/admin' : '/dashboard'}
                  className="px-4 py-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 font-medium hover:scale-105"
                >
                  {user.role === 'admin' ? 'Admin' : user.name}
                </Link>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 font-medium hover:scale-105"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 font-medium hover:scale-105"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 font-medium hover:scale-105"
                >
                  Inscription
                </Link>
              </>
            )}
          </nav>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link to="/checkout" className="relative p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-all">
              <ShoppingCartIcon className="w-6 h-6" />
              <span className="absolute -top-2 -right-2 w-6 h-6 bg-accent-500 text-xs rounded-full flex items-center justify-center font-bold">
                3
              </span>
            </Link>
            
            {/* AI Assistant Toggle */}
            <button className="p-2 text-accent-400 hover:text-accent-300 hover:bg-accent-500/20 rounded-xl transition-all group">
              <SparklesIcon className="w-6 h-6 group-hover:animate-pulse" title="AI Assistant" />
            </button>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2 rounded-xl hover:bg-white/10">
            <Bars3Icon className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

