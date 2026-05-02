import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../utils/api.js';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const SkeletonCard = () => (
  <div className="card border-left-primary shadow h-100 py-2">
    <div className="card-body">
      <div className="row no-gutters align-items-center">
        <div className="col mr-2">
          <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
            <span className="placeholder col-6"></span>
          </div>
          <div className="h5 mb-0 font-weight-bold text-gray-800">
            <span className="placeholder col-4"></span>
          </div>
        </div>
        <div className="col-auto">
          <div className="placeholder col-2" style={{ width: '32px', height: '32px' }}></div>
        </div>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeOrders: 0,
    totalSpent: '$0',
    totalOrders: 0,
    wishlist: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);

  const spendingData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Monthly Spending',
      data: [120, 190, 150, 250, 220, 300],
      fill: true,
      backgroundColor: 'rgba(78, 115, 223, 0.05)',
      borderColor: 'rgba(78, 115, 223, 1)',
      tension: 0.4,
      pointBackgroundColor: 'rgba(78, 115, 223, 1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(78, 115, 223, 1)'
    }]
  };

  const spendingOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: { beginAtZero: true, grid: { borderDash: [2, 2] } },
      x: { grid: { display: false } }
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [s, o] = await Promise.all([
          api.getDashboardStats().catch(() => null),
          api.getRecentOrders(5).catch(() => [])
        ]);
        
        setStats(s || {
          activeOrders: 3,
          totalSpent: '$1,234',
          totalOrders: 12,
          wishlist: 5
        });
        setRecentOrders(o || []);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        setStats({
          activeOrders: 3,
          totalSpent: '$1,234',
          totalOrders: 12,
          wishlist: 5
        });
        setRecentOrders([
          { id: '#1234', customer: user?.name || 'You', product: 'AI Resume Builder', amount: '$9.99', status: 'completed', date: '2024-10-01' },
          { id: '#1235', customer: user?.name || 'You', product: 'Code Autocompletion Pro', amount: '$49.99', status: 'pending', date: '2024-10-07' },
          { id: '#1236', customer: user?.name || 'You', product: 'React Boilerplate', amount: '$39.99', status: 'shipped', date: '2024-10-05' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user]);

  const statCards = [
    { title: 'Active Orders', value: stats.activeOrders, icon: 'fas fa-shopping-cart', color: 'primary', link: '/dashboard/orders' },
    { title: 'Total Spent', value: stats.totalSpent, icon: 'fas fa-dollar-sign', color: 'success', link: '/dashboard/analytics' },
    { title: 'Total Orders', value: stats.totalOrders, icon: 'fas fa-box', color: 'info', link: '/dashboard/orders' },
    { title: 'Wishlist', value: stats.wishlist, icon: 'fas fa-heart', color: 'danger', link: '/shop' },
  ];

  const getStatusBadge = (status) => {
    const map = {
      completed: 'bg-success',
      shipped: 'bg-info',
      pending: 'bg-warning',
      cancelled: 'bg-danger'
    };
    return map[status?.toLowerCase()] || 'bg-secondary';
  };

  return (
    <>
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-0 text-gray-800">Welcome back, {user?.name || 'User'}!</h1>
          <p className="text-muted mb-0">Here is what&apos;s happening with your account today.</p>
        </div>
        <ol className="breadcrumb mb-0">
          <li className="breadcrumb-item active">Dashboard</li>
        </ol>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        {loading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="col-xl-3 col-md-6 mb-4">
              <SkeletonCard />
            </div>
          ))
        ) : (
          statCards.map((stat, index) => (
            <div key={index} className="col-xl-3 col-md-6 mb-4">
              <Link to={stat.link} className="text-decoration-none">
                <div className={`card border-left-${stat.color} shadow h-100 py-2 hover-shadow transition-all`}>
                  <div className="card-body">
                    <div className="row no-gutters align-items-center">
                      <div className="col mr-2">
                        <div className={`text-xs font-weight-bold text-${stat.color} text-uppercase mb-1`}>
                          {stat.title}
                        </div>
                        <div className="h5 mb-0 font-weight-bold text-gray-800">{stat.value}</div>
                      </div>
                      <div className="col-auto">
                        <i className={`${stat.icon} fa-2x text-gray-300`}></i>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))
        )}
      </div>

      <div className="row">
        {/* Spending Chart */}
        <div className="col-xl-8 col-lg-7">
          <div className="card shadow mb-4">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
              <h6 className="m-0 font-weight-bold text-primary">
                <i className="fas fa-chart-line me-2"></i>
                Spending Overview
              </h6>
              <Link to="/dashboard/analytics" className="btn btn-sm btn-primary">View Details</Link>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="placeholder-glow">
                  <div className="placeholder col-12" style={{ height: '300px' }}></div>
                </div>
              ) : (
                <div style={{ position: 'relative', height: '300px' }}>
                  <Line data={spendingData} options={spendingOptions} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="col-xl-4 col-lg-5">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">
                <i className="fas fa-bolt me-2"></i>
                Quick Actions
              </h6>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <Link to="/shop" className="btn btn-outline-primary d-flex align-items-center justify-content-between">
                  <span><i className="fas fa-store me-2"></i> Browse Shop</span>
                  <i className="fas fa-arrow-right"></i>
                </Link>
                <Link to="/dashboard/orders" className="btn btn-outline-success d-flex align-items-center justify-content-between">
                  <span><i className="fas fa-box me-2"></i> My Orders</span>
                  <i className="fas fa-arrow-right"></i>
                </Link>
                <Link to="/dashboard/profile" className="btn btn-outline-info d-flex align-items-center justify-content-between">
                  <span><i className="fas fa-user me-2"></i> Edit Profile</span>
                  <i className="fas fa-arrow-right"></i>
                </Link>
                <Link to="/contact" className="btn btn-outline-warning d-flex align-items-center justify-content-between">
                  <span><i className="fas fa-headset me-2"></i> Contact Support</span>
                  <i className="fas fa-arrow-right"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card shadow mb-4">
        <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
          <h6 className="m-0 font-weight-bold text-primary">
            <i className="fas fa-clock me-2"></i>
            Recent Orders
          </h6>
          <Link to="/dashboard/orders" className="btn btn-sm btn-primary">View All</Link>
        </div>
        <div className="card-body">
          {loading ? (
            <div className="placeholder-glow">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="placeholder col-12 mb-2" style={{ height: '40px' }}></div>
              ))}
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Order ID</th>
                    <th>Product</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center text-muted py-4">
                        <i className="fas fa-inbox fa-2x mb-2 d-block"></i>
                        No orders yet. <Link to="/shop">Start shopping!</Link>
                      </td>
                    </tr>
                  ) : (
                    recentOrders.map((order, index) => (
                      <tr key={index}>
                        <td className="fw-bold text-primary">{order.id || `#ORD${index + 1}`}</td>
                        <td>{order.product || order.name || 'N/A'}</td>
                        <td className="fw-bold">{order.amount || '$0.00'}</td>
                        <td>
                          <span className={`badge ${getStatusBadge(order.status)}`}>
                            {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Pending'}
                          </span>
                        </td>
                        <td className="text-muted">{order.date || 'N/A'}</td>
                        <td>
                          <button className="btn btn-sm btn-outline-primary">
                            <i className="fas fa-eye"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;

