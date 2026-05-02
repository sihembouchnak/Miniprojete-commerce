import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../../utils/api.js';
import { useAuth } from '../../../contexts/AuthContext.jsx';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const SkeletonCard = ({ color }) => (
  <div className={`card border-left-${color} shadow h-100 py-2`}>
    <div className="card-body">
      <div className="row no-gutters align-items-center">
        <div className="col mr-2">
          <div className="text-xs font-weight-bold text-uppercase mb-1">
            <span className="placeholder col-6"></span>
          </div>
          <div className="h5 mb-0 font-weight-bold text-gray-800">
            <span className="placeholder col-4"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const formatCurrency = (val) => {
  if (val === undefined || val === null) return '$0';
  return '$' + Number(val).toLocaleString();
};

const AdminDashboardPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    activeUsers: 0,
    newOrders: 0,
    totalProducts: 0,
    pendingOrders: 0,
    completedOrders: 0,
    monthlyRevenue: [],
    statusDistribution: [],
    revenueByProduct: [],
  });
  const [ordersData, setOrdersData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [s, o, p] = await Promise.all([
          api.getDashboardStats().catch(() => null),
          api.getRecentOrders(10).catch(() => []),
          api.getProductsList(5).catch(() => []),
        ]);

        setStats(s || {
          totalRevenue: 0,
          activeUsers: 0,
          newOrders: 0,
          totalProducts: 0,
          pendingOrders: 0,
          completedOrders: 0,
          monthlyRevenue: [],
          statusDistribution: [],
          revenueByProduct: [],
        });
        setOrdersData(o || []);
        setTopProducts(p || []);
      } catch (error) {
        console.error('Failed to fetch admin dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Build monthly revenue chart data
  const monthlyMap = new Array(12).fill(0);
  (stats.monthlyRevenue || []).forEach((m) => {
    const idx = (m._id || m.month || 1) - 1;
    if (idx >= 0 && idx < 12) monthlyMap[idx] = m.revenue || 0;
  });

  const areaData = {
    labels: MONTHS,
    datasets: [{
      label: 'Sales',
      data: monthlyMap,
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

  const areaOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, grid: { borderDash: [2, 2] } },
      x: { grid: { display: false } }
    }
  };

  // Build revenue by product chart
  const revProducts = (stats.revenueByProduct || []).slice(0, 5);
  const barData = {
    labels: revProducts.length > 0 ? revProducts.map(r => r._id || r.name) : ['No Data'],
    datasets: [{
      label: 'Revenue',
      data: revProducts.length > 0 ? revProducts.map(r => r.revenue || 0) : [0],
      backgroundColor: [
        'rgba(78, 115, 223, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(153, 102, 255, 0.8)'
      ],
      borderWidth: 1
    }]
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } }
  };

  // Build status distribution chart
  const statusDist = stats.statusDistribution || [];
  const statusLabels = ['Completed', 'Pending', 'Shipped', 'Cancelled'];
  const statusColors = ['#1cc88a', '#f6c23e', '#36b9cc', '#e74a3b'];
  const statusData = statusLabels.map(label => {
    const found = statusDist.find(s => (s._id || s.status || '').toLowerCase() === label.toLowerCase());
    return found ? found.count : 0;
  });

  const doughnutData = {
    labels: statusLabels,
    datasets: [{
      data: statusData,
      backgroundColor: statusColors,
      hoverBackgroundColor: ['#17a673', '#dda20a', '#2c9faf', '#be3e31'],
      borderWidth: 0
    }]
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: { position: 'bottom', labels: { padding: 20, usePointStyle: true } }
    }
  };

  const statCards = [
    { title: 'Total Revenue', value: formatCurrency(stats.totalRevenue), icon: 'fas fa-dollar-sign', color: 'primary', change: '+12%' },
    { title: 'Active Users', value: stats.activeUsers, icon: 'fas fa-users', color: 'success', change: '+5%' },
    { title: 'New Orders', value: stats.pendingOrders || stats.newOrders || 0, icon: 'fas fa-shopping-cart', color: 'info', change: '+8%' },
    { title: 'Products', value: stats.totalProducts, icon: 'fas fa-boxes', color: 'warning', change: '+3%' },
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

  const topProductsList = topProducts.length > 0 ? topProducts.map(p => ({
    name: p.name || 'Unknown',
    sales: p.sales || p.stock || 0,
    revenue: formatCurrency((p.price || 0) * (p.sales || 0)),
  })) : [
    { name: 'AI Resume Builder', sales: 127, revenue: '$1,268.73' },
    { name: 'Code Autocompletion Pro', sales: 89, revenue: '$4,449.11' },
    { name: 'React Boilerplate', sales: 203, revenue: '$8,097.97' },
    { name: 'Smart Dashboard', sales: 156, revenue: '$4,678.44' },
    { name: 'E-commerce Template', sales: 98, revenue: '$5,879.02' },
  ];

  return (
    <>
      {/* Page Header */}
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <div>
          <h1 className="h2">Admin Dashboard</h1>
          <p className="text-muted mb-0">Welcome back, {user?.name || 'Admin'}! Here&apos;s what&apos;s happening.</p>
        </div>
        <div className="btn-toolbar mb-2 mb-md-0">
          <div className="btn-group me-2">
            <button type="button" className="btn btn-sm btn-outline-secondary">
              <i className="fas fa-share-alt me-1"></i> Share
            </button>
            <button type="button" className="btn btn-sm btn-outline-secondary">
              <i className="fas fa-download me-1"></i> Export
            </button>
          </div>
          <Link to="/admin/products" className="btn btn-sm btn-primary">
            <i className="fas fa-plus me-1"></i> Add Product
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        {loading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="col-xl-3 col-md-6 mb-4">
              <SkeletonCard color="primary" />
            </div>
          ))
        ) : (
          statCards.map((stat, index) => (
            <div key={index} className="col-xl-3 col-md-6 mb-4">
              <div className={`card border-left-${stat.color} shadow h-100 py-2`}>
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className={`text-xs font-weight-bold text-${stat.color} text-uppercase mb-1`}>
                        {stat.title}
                      </div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">{stat.value}</div>
                      <div className="small text-success mt-1">
                        <i className="fas fa-arrow-up"></i> {stat.change} from last month
                      </div>
                    </div>
                    <div className="col-auto">
                      <i className={`${stat.icon} fa-2x text-gray-300`}></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Charts Row */}
      <div className="row">
        <div className="col-xl-8">
          <div className="card shadow mb-4">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
              <h6 className="m-0 font-weight-bold text-primary">
                <i className="fas fa-chart-area me-2"></i>
                Sales Overview
              </h6>
              <div className="dropdown no-arrow">
                <button className="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                  This Year
                </button>
              </div>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="placeholder col-12" style={{ height: '350px' }}></div>
              ) : (
                <div style={{ position: 'relative', height: '350px' }}>
                  <Line data={areaData} options={areaOptions} />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="col-xl-4">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">
                <i className="fas fa-chart-pie me-2"></i>
                Order Status
              </h6>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="placeholder col-12" style={{ height: '250px' }}></div>
              ) : (
                <div style={{ position: 'relative', height: '250px' }}>
                  <Doughnut data={doughnutData} options={doughnutOptions} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Revenue by Product */}
        <div className="col-xl-6">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">
                <i className="fas fa-chart-bar me-2"></i>
                Revenue by Product
              </h6>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="placeholder col-12" style={{ height: '300px' }}></div>
              ) : (
                <div style={{ position: 'relative', height: '300px' }}>
                  <Bar data={barData} options={barOptions} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="col-xl-6">
          <div className="card shadow mb-4">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
              <h6 className="m-0 font-weight-bold text-primary">
                <i className="fas fa-crown me-2"></i>
                Top Products
              </h6>
              <Link to="/admin/products" className="btn btn-sm btn-primary">View All</Link>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="placeholder-glow">
                  {Array(5).fill(0).map((_, i) => (
                    <div key={i} className="placeholder col-12 mb-3" style={{ height: '40px' }}></div>
                  ))}
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Product</th>
                        <th>Sales</th>
                        <th>Revenue</th>
                        <th>Progress</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topProductsList.map((product, index) => {
                        const maxSales = Math.max(...topProductsList.map(p => p.sales));
                        const percent = maxSales > 0 ? Math.round((product.sales / maxSales) * 100) : 0;
                        return (
                          <tr key={index}>
                            <td className="fw-bold">{product.name}</td>
                            <td>{product.sales}</td>
                            <td className="fw-bold text-success">{product.revenue}</td>
                            <td style={{ width: '30%' }}>
                              <div className="progress" style={{ height: '8px' }}>
                                <div
                                  className="progress-bar bg-primary"
                                  role="progressbar"
                                  style={{ width: `${percent}%` }}
                                  aria-valuenow={percent}
                                  aria-valuemin="0"
                                  aria-valuemax="100"
                                ></div>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Orders DataTable */}
      <div className="card shadow mb-4">
        <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
          <h6 className="m-0 font-weight-bold text-primary">
            <i className="fas fa-table me-2"></i>
            Recent Orders
          </h6>
          <Link to="/admin/orders" className="btn btn-sm btn-primary">View All Orders</Link>
        </div>
        <div className="card-body">
          {loading ? (
            <div className="placeholder-glow">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="placeholder col-12 mb-2" style={{ height: '40px' }}></div>
              ))}
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Product</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {ordersData.map((order, index) => (
                    <tr key={index}>
                      <td className="fw-bold text-primary">{order.id || `#ORD${index + 1}`}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: '32px', height: '32px', fontSize: '12px' }}>
                            {(order.customerName || order.customer || 'U').charAt(0).toUpperCase()}
                          </div>
                          {order.customerName || order.customer || 'N/A'}
                        </div>
                      </td>
                      <td>{(order.items || []).map(i => i.name).join(', ') || order.product || 'N/A'}</td>
                      <td className="fw-bold">{formatCurrency(order.total || order.amount)}</td>
                      <td>
                        <span className={`badge ${getStatusBadge(order.status)}`}>
                          {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Pending'}
                        </span>
                      </td>
                      <td className="text-muted">{order.date ? new Date(order.date).toLocaleDateString() : 'N/A'}</td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary me-1">
                          <i className="fas fa-eye"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-danger">
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminDashboardPage;

