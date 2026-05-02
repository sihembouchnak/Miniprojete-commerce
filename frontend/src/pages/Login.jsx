import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { ArrowRightIcon, EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirect = new URLSearchParams(location.search).get('redirect') || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await login(email, password);
      if (user.role === 'admin') {
        navigate(redirect === '/admin' ? '/admin' : '/admin', { replace: true });
      } else {
        navigate(redirect === '/admin' ? '/dashboard' : redirect, { replace: true });
      }
    } catch (err) {
      setError('Invalid credentials. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-800 via-slate-900/30 to-slate-800">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-100 via-white to-primary-400 bg-clip-text text-transparent mb-4">
            Welcome Back
          </h2>
          <p className="text-slate-300 text-lg font-medium">Sign in to your Smart Tech Store account</p>
        </div>

        {/* Admin credentials hidden - use backend or config for real admin */}
        
        {error && (
          <div className="bg-red-500/30 border-2 border-red-500/50 text-red-200 p-4 rounded-2xl backdrop-blur-sm font-medium">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-3">
                Email Address
              </label>
              <div className="relative">
                <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 pl-12 py-4 bg-white/15 border border-slate-600/50 rounded-2xl text-slate-100 placeholder-slate-300 backdrop-blur-md focus:ring-4 focus:ring-primary-400/50 focus:border-primary-400 transition-all duration-200 shadow-sm hover:border-slate-500/70"
                  placeholder="email@example.com"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-3">
                Password
              </label>
              <div className="relative">
                <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 pl-12 py-4 bg-white/15 border border-slate-600/50 rounded-2xl text-slate-100 placeholder-slate-300 backdrop-blur-md focus:ring-4 focus:ring-primary-400/50 focus:border-primary-400 transition-all duration-200 shadow-sm hover:border-slate-500/70"
                  placeholder="your password"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary-400 to-accent-400 hover:from-primary-500 hover:to-accent-500 text-slate-900 font-bold py-4 px-6 rounded-2xl shadow-glow-lg transform hover:scale-105 hover:shadow-glow-xl transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <span>Sign In Securely</span>
                <ArrowRightIcon className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="text-center space-y-2 pt-4 border-t border-slate-700/50">
          <p className="text-sm text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-primary-400 hover:text-primary-300 transition-colors">
              Create Account
            </Link>
          </p>
            {/* Direct admin link removed to hide from users */}
        </div>
      </div>
    </div>
  );
};

export default Login;

