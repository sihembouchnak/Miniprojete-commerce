import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

const TopNav = () => {
  const { user, logout } = useAuth();

  return (
    <div className="glass border-b border-slate-700/50">
      <div className="container py-3">
        <div className="flex items-center justify-between text-sm text-slate-400">
          <div className="flex space-x-6">
            <span>🚀 Premium AI & Dev Tools</span>
            <Link to="/shop" className="hover:text-accent-400 transition-colors">Boutique</Link>
            <Link to="/contact" className="hover:text-accent-400 transition-colors">Contact</Link>
            {user ? (
              <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="hover:text-accent-400 transition-colors">
                {user.role === 'admin' ? 'Admin' : 'Mon Espace'}
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
  );
};

export default TopNav;

