import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { ShoppingBagIcon, ChartBarIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user, logout } = useAuth();

return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0 text-gray-800">User Dashboard</h1>
        <ol className="breadcrumb mb-0">
          <li className="breadcrumb-item active">Dashboard</li>
        </ol>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-xl-4 col-md-6 mb-4">
          <div className="card border-left-primary shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">Active Orders</div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">3</div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-shopping-cart fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-4 col-md-6 mb-4">
          <div className="card border-left-success shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-success text-uppercase mb-1">Total Spent</div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">$1,234</div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-dollar-sign fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-4 col-md-6 mb-4">
          <div className="card border-left-info shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-info text-uppercase mb-1">Support</div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">24/7 Available</div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-headset fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row">
        <div className="col-xl-4 col-md-6 mb-4">
          <div className="card border-left-primary shadow-sm h-100">
            <div className="card-body">
              <h6 className="card-title font-weight-bold text-primary mb-3">View Orders</h6>
              <p className="card-text">Manage your active orders and track deliveries.</p>
              <Link to="/shop" className="btn btn-primary">Shop Now</Link>
            </div>
          </div>
        </div>
        <div className="col-xl-4 col-md-6 mb-4">
          <div className="card border-left-success shadow-sm h-100">
            <div className="card-body">
              <h6 className="card-title font-weight-bold text-success mb-3">Analytics</h6>
              <p className="card-text">View your spending analytics and purchase history.</p>
              <button className="btn btn-success">View Stats</button>
            </div>
          </div>
        </div>
        <div className="col-xl-4 col-md-6 mb-4">
          <div className="card border-left-info shadow-sm h-100">
            <div className="card-body">
              <h6 className="card-title font-weight-bold text-info mb-3">Get Support</h6>
              <p className="card-text">Contact our 24/7 support team for assistance.</p>
              <Link to="/contact" className="btn btn-info">Contact Us</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-4">
        <button onClick={logout} className="btn btn-secondary btn-lg">
          <i className="fas fa-sign-out-alt me-2"></i> Logout
        </button>
      </div>
    </>
  );
};

export default Dashboard;

