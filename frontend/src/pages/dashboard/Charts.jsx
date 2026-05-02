import React, { useEffect, useState } from 'react';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
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
import { api } from '../../utils/api.js';

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

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const formatCurrency = (val) => {
  if (val === undefined || val === null) return '$0';
  return '$' + Number(val).toLocaleString();
};

const Charts = () => {
  const [timeRange, setTimeRange] = useState('year');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    monthlyRevenue: [],
    revenueByProduct: [],
    statusDistribution: [],
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const s = await api.getDashboardStats().catch(() => null);
        setStats(s || {
          totalRevenue: 0,
          totalOrders: 0,
          pendingOrders: 0,
          monthlyRevenue: [],
          revenueByProduct: [],
          statusDistribution: [],
        });
      } catch (error) {
        console.error('Failed to fetch chart data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

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
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Revenue Over Time' }
    },
    scales: {
      y: { beginAtZero: true, grid: { borderDash: [2, 2] } },
      x: { grid: { display: false } }
    }
  };

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
      borderColor: [
        'rgba(78, 115, 223, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)'
      ],
      borderWidth: 1,
      borderRadius: 4
    }]
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Revenue by Product' }
    },
    scales: {
      y: { beginAtZero: true, grid: { borderDash: [2, 2] } },
      x: { grid: { display: false } }
    }
  };

  const statusDist = stats.statusDistribution || [];
  const pieLabels = ['Completed', 'Pending', 'Shipped', 'Cancelled'];
  const pieColors = ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e'];
  const pieDataVals = pieLabels.map(label => {
    const found = statusDist.find(s => (s._id || s.status || '').toLowerCase() === label.toLowerCase());
    return found ? found.count : 0;
  });

  const pieData = {
    labels: pieLabels,
    datasets: [{
      data: pieDataVals,
      backgroundColor: pieColors,
      hoverBackgroundColor: ['#2e59d9', '#17a673', '#2c9faf', '#dda20a'],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: { display: true, text: 'Order Status Distribution' },
      legend: { position: 'bottom', labels: { padding: 20, usePointStyle: true } }
    }
  };

  const doughnutData = {
    labels: pieLabels,
    datasets: [{
      data: pieDataVals,
      backgroundColor: ['#4e73df', '#e74a3b', '#1cc88a', '#f6c23e'],
      hoverBackgroundColor: ['#2e59d9', '#be3e31', '#17a673', '#dda20a'],
      borderWidth: 0
    }]
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '60%',
    plugins: {
      title: { display: true, text: 'Sales by Status' },
      legend: { position: 'bottom', labels: { padding: 20, usePointStyle: true } }
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-0 text-gray-800">Charts &amp; Analytics</h1>
          <p className="text-muted mb-0">Visualize your data with interactive charts.</p>
        </div>
        <ol className="breadcrumb mb-0">
          <li className="breadcrumb-item"><a href="/admin">Dashboard</a></li>
          <li className="breadcrumb-item active">Charts</li>
        </ol>
      </div>

      <div className="mb-4">
        <div className="btn-group" role="group">
          <button
            type="button"
            className={'btn ' + (timeRange === 'year' ? 'btn-primary' : 'btn-outline-primary')}
            onClick={() => setTimeRange('year')}
          >
            This Year
          </button>
          <button
            type="button"
            className={'btn ' + (timeRange === 'month' ? 'btn-primary' : 'btn-outline-primary')}
            onClick={() => setTimeRange('month')}
          >
            This Month
          </button>
        </div>
      </div>

      <div className="row">
        <div className="col-xl-8">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">
                <i className="fas fa-chart-area me-2"></i>
                Sales Overview
              </h6>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="placeholder col-12" style={{ height: '400px' }}></div>
              ) : (
                <div style={{ position: 'relative', height: '400px' }}>
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
                Sales by Status
              </h6>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="placeholder col-12" style={{ height: '300px' }}></div>
              ) : (
                <div style={{ position: 'relative', height: '300px' }}>
                  <Doughnut data={doughnutData} options={doughnutOptions} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row">
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
                <div className="placeholder col-12" style={{ height: '350px' }}></div>
              ) : (
                <div style={{ position: 'relative', height: '350px' }}>
                  <Bar data={barData} options={barOptions} />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="col-xl-6">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">
                <i className="fas fa-chart-pie me-2"></i>
                Order Status Distribution
              </h6>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="placeholder col-12" style={{ height: '350px' }}></div>
              ) : (
                <div style={{ position: 'relative', height: '350px' }}>
                  <Pie data={pieData} options={pieOptions} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-primary shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">Total Revenue</div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{formatCurrency(stats.totalRevenue)}</div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-dollar-sign fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-success shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-success text-uppercase mb-1">Orders</div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{stats.totalOrders || 0}</div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-shopping-cart fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-warning shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">Pending</div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{stats.pendingOrders || 0}</div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-comments fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Charts;