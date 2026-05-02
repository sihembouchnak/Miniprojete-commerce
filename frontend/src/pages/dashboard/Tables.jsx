import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { api } from '../../utils/api.js';

const Tables = () => {
  const { user } = useAuth();
  const dataTableRef = useRef(null);
  const [productsData, setProductsData] = useState([]);
  const [ordersData, setOrdersData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let dataTable;

    const loadData = async () => {
      setLoading(true);
      try {
        const [products, orders] = await Promise.all([
          api.getAllProductsAdmin().catch(() => []),
          api.getAllOrders().catch(() => []),
        ]);
        setProductsData(products || []);
        setOrdersData(orders || []);
      } catch (error) {
        console.error('Failed to fetch table data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    const initDataTable = () => {
      if (dataTableRef.current && window.simpleDatatables) {
        dataTable = new window.simpleDatatables.DataTable(dataTableRef.current, {
          searchable: true,
          fixedHeader: true,
          paging: true,
          perPage: 10,
          perPageSelect: [10, 25, 50, 100],
          labels: {
            placeholder: "Search...",
            perPage: "{select} entries per page",
            noRows: "No entries found",
            info: "Showing {start} to {end} of {rows} entries"
          }
        });
      }
    };

    const timer = setTimeout(initDataTable, 300);
    return () => {
      clearTimeout(timer);
      if (dataTable) dataTable.destroy();
    };
  }, []);

  const formatCurrency = (val) => {
    if (val === undefined || val === null) return '$0.00';
    return '$' + Number(val).toFixed(2);
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0 text-gray-800">Tables</h1>
        <ol className="breadcrumb mb-0">
          <li className="breadcrumb-item"><a href="/admin">Dashboard</a></li>
          <li className="breadcrumb-item active">Tables</li>
</ol>
      </div>

      <div className="card mb-4">
        <div className="card-header">
          <i className="fas fa-table me-1"></i>
          Products DataTable
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
              <table ref={dataTableRef} className="table table-striped table-hover" id="datatablesSimple">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Stock</th>
                    <th>Price</th>
                    <th>Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {productsData.map((product, idx) => (
                    <tr key={idx}>
                      <td>{product.name || 'N/A'}</td>
                      <td>
                        <span className="badge bg-info">{product.category || 'N/A'}</span>
                      </td>
                      <td>{product.stock ?? 0}</td>
                      <td>{formatCurrency(product.price)}</td>
                      <td>{formatDate(product.updatedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-header">
          <i className="fas fa-shopping-cart me-1"></i>
          Recent Orders
        </div>
        <div className="card-body">
          {loading ? (
            <div className="placeholder-glow">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="placeholder col-12 mb-2" style={{ height: '40px' }}></div>
              ))}
            </div>
          ) : (
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {ordersData.map((order, idx) => (
                  <tr key={idx}>
                    <td>{order.id || order._id || `#${idx + 1}`}</td>
                    <td>{order.customerName || order.customer || 'N/A'}</td>
                    <td>{(order.items || []).map(i => i.name).join(', ') || 'N/A'}</td>
                    <td>{formatCurrency(order.total || order.amount)}</td>
                    <td>
                      <span className={`badge ${(order.status || 'pending').toLowerCase() === 'completed' ? 'bg-success' : (order.status || 'pending').toLowerCase() === 'shipped' ? 'bg-info' : 'bg-warning'}`}>
                        {order.status || 'Pending'}
                      </span>
                    </td>
                    <td>{formatDate(order.date || order.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
    </>
  );
};

export default Tables;
