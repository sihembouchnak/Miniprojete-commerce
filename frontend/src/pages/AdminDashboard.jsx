import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
// Heroicons not needed for Bootstrap version

const AdminDashboard = () => {
  const { user } = useAuth();

  const stats = [
    { title: 'Earnings (Monthly)', value: '$40,000', icon: 'fas fa-calendar', color: 'primary' },
    { title: 'Earnings (Annual)', value: '$215,000', icon: 'fas fa-dollar-sign', color: 'success' },
    { title: 'Tasks', value: '50%', icon: 'fas fa-comments', color: 'info' },
    { title: 'Pending Requests', value: '18', icon: 'fas fa-paper-plane', color: 'warning' }
  ];

  const products = [
    { name: 'AI Resume Builder', price: '$9.99', sales: 127, status: 'active' },
    { name: 'Code Autocompletion Pro', price: '$49.99', sales: 89, status: 'active' },
    { name: 'React Boilerplate', price: '$39.99', sales: 203, status: 'active' }
  ];

  const recentOrders = [
    { id: '#1234', customer: 'John Doe', product: 'AI Resume Builder', amount: '$9.99', status: 'completed' },
    { id: '#1235', customer: 'Jane Smith', product: 'Code Autocompletion Pro', amount: '$49.99', status: 'pending' },
    { id: '#1236', customer: 'Bob Johnson', product: 'React Boilerplate', amount: '$39.99', status: 'shipped' }
  ];

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">Admin Dashboard</h1>
        <div className="btn-toolbar mb-2 mb-md-0">
          <div className="btn-group me-2">
            <button type="button" className="btn btn-sm btn-outline-secondary">Share</button>
            <button type="button" className="btn btn-sm btn-outline-secondary">Export</button>
          </div>
        </div>
      </div>

      <div className="row">
        {stats.map((stat, index) => (
          <div key={index} className="col-xl-3 col-md-6 mb-4">
            <div className={`card border-left-${stat.color} shadow h-100 py-2`}>
              <div className="card-body">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-3">
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
          </div>
        ))}
      </div>

      <div className="row">
        {/* Products Table */}
        <div className="col-lg-8 mb-4">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">Products Table</h6>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-bordered" width="100%" cellSpacing="0">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Price</th>
                      <th>Sales</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product, index) => (
                      <tr key={index}>
                        <td>{product.name}</td>
                        <td>{product.price}</td>
                        <td>{product.sales}</td>
                        <td>
                          <span className={`badge bg-${product.status === 'active' ? 'success' : 'secondary'}`}>
                            {product.status.toUpperCase()}
                          </span>
                        </td>
                        <td>
                          <a href="#" className="btn btn-sm btn-primary"><i className="fas fa-edit"></i></a>
                          <a href="#" className="btn btn-sm btn-danger"><i className="fas fa-trash"></i></a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="col-lg-4 mb-4">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">Recent Orders</h6>
            </div>
            <div className="card-body">
              {recentOrders.map((order, index) => (
                <div key={index} className="d-flex no-gutters py-3 px-0 border-bottom">
                  <div className="col mr-3">
                    <h6 className="mb-1">{order.id}</h6>
                    <small className="text-gray-500">{order.customer} - {order.product}</small>
                  </div>
                  <div className="col-auto">
                    <span className={`badge bg-${order.status === 'completed' ? 'success' : order.status === 'shipped' ? 'info' : 'warning'}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;

