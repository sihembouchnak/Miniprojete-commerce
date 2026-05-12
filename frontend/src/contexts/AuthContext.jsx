import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('auth_user');
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('auth_user');
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3003';

  const login = async (email, password) => {
    const normalizedEmail = email.toLowerCase();

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Login failed');
      }

      const data = await response.json().catch(() => ({}));
      const token = data.access_token || data.token || 'mock-jwt';
      const userData = data.user ?? {
        name: normalizedEmail.split('@')[0],
        email: normalizedEmail,
        role: normalizedEmail === 'admin@smartstore.com' && password === 'admin123' ? 'admin' : 'user',
      };

      localStorage.setItem('token', token);
      localStorage.setItem('auth_user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (error) {
      // Fallback to mock for demo
      let userData;

      if (normalizedEmail === 'admin@smartstore.com' && password === 'admin123') {
        userData = { name: 'Admin', email: normalizedEmail, role: 'admin' };
      } else {
        userData = { name: normalizedEmail.split('@')[0], email: normalizedEmail, role: 'user' };
      }

      localStorage.setItem('token', 'mock-jwt');
      localStorage.setItem('auth_user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }

      const data = await response.json();
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('auth_user', JSON.stringify(data.user));
      setUser(data.user);
      return data.user;
    } catch (error) {
      // Fallback to mock
      const userData = { name, email: email.toLowerCase(), role: 'user' };
      localStorage.setItem('token', 'mock-jwt');
      localStorage.setItem('auth_user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('auth_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

