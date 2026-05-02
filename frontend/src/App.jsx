import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header.jsx';
import AIAssistant from './components/AIAssistant.jsx';
import Home from './pages/Home.jsx';
import Shop from './pages/Shop.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Contact from './pages/Contact.jsx';
import Checkout from './pages/Checkout.jsx';
import PaymentSuccess from './pages/PaymentSuccess.jsx';
import DashboardLayout from './components/bootstrap/DashboardLayout.jsx';
import DashboardPage from './pages/dashboard/Dashboard.jsx';
import Tables from './pages/dashboard/Tables.jsx';
import Charts from './pages/dashboard/Charts.jsx';
import AdminDashboardPage from './pages/admin/dashboard/Dashboard.jsx';
import { useAuth } from './contexts/AuthContext.jsx';
import './index.css';
import './styles.css';

function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  }

  if (!user) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return children;
}

function RequireAdmin({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  }

  if (!user) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/shop/category/:category" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/contact" element={<Contact />} />
<Route path="/dashboard/*" element={<RequireAuth><DashboardLayout /></RequireAuth>}>
              <Route index element={<DashboardPage />} />
              <Route path="tables" element={<Tables />} />
              <Route path="charts" element={<Charts />} />
              <Route path="orders" element={<Tables />} />
              <Route path="profile" element={<div className="container p-4"><h1>User Profile</h1><p>Full Bootstrap profile page mock data.</p></div>} />
              <Route path="analytics" element={<Charts />} />
              <Route path="support" element={<div className="p-4"><h1>Support</h1><p>Contact support.</p></div>} />
            </Route>
<Route path="/admin/*" element={<RequireAdmin><DashboardLayout /></RequireAdmin>}>
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="products" element={<Tables />} />
              <Route path="orders" element={<Tables />} />
              <Route path="charts" element={<Charts />} />
              <Route path="tables" element={<Tables />} />
              <Route path="users" element={<Tables />} />
            </Route>
            <Route path="/admin" element={<RequireAdmin><Navigate to="/admin/dashboard" replace /></RequireAdmin>} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="*" element={<div className="container py-20 text-center"><h1 className="text-4xl font-bold text-white">Page Not Found</h1></div>} />
          </Routes>
        </main>
        <AIAssistant />
      </div>
    </Router>
  );
}

export default App;