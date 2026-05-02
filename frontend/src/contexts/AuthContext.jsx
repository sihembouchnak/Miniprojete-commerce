import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api.js';

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
        localStorage.removeItem('token');
        localStorage.removeItem('auth_user');
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await api.login(email, password);
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('auth_user', JSON.stringify(response.user));
      setUser(response.user);
    }
    return response.user;
  };

  const register = async (name, email, password) => {
    const response = await api.register(name, email, password);
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('auth_user', JSON.stringify(response.user));
      setUser(response.user);
    }
    return response.user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('auth_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

