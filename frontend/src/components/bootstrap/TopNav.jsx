import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';

const TopNav = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark">
      {/* Navbar Brand */}
      <Link className="navbar-brand ps-3" to={user?.role === 'admin' ? '/admin/dashboard' : '/dashboard'}>
        SmartStore Admin
      </Link>
      
      {/* Sidebar Toggle */}
      <button className="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0" id="sidebarToggle" href="#!">
        <i className="fas fa-bars"></i>
      </button>
      
      {/* Navbar Search */}
      <form className="d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0">
        <div className="input-group">
          <input 
            className="form-control" 
            type="text" 
            placeholder="Search for..." 
            aria-label="Search for..." 
            aria-describedby="btnNavbarSearch" 
          />
          <button className="btn btn-primary" id="btnNavbarSearch" type="button">
            <i className="fas fa-search"></i>
          </button>
        </div>
      </form>
      
      {/* Navbar */}
      <ul className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
        {/* Navbar Alerts */}
        <li className="nav-item dropdown no-arrow mx-1">
          <a className="nav-link dropdown-toggle" href="#" id="alertsDropdown" role="button" data-bs-toggle="dropdown">
            <i className="fas fa-bell fa-fw"></i>
            <span className="badge bg-warning rounded-pill">4 New!</span>
          </a>
          <div className="dropdown-list dropdown-menu dropdown-menu-end shadow" aria-labelledby="alertsDropdown">
            <h6 className="dropdown-header">
              Alerts Center
            </h6>
            <a className="dropdown-item d-flex align-items-center" href="#">
              <div className="bg-danger text-white rounded-circle me-3">
                <i className="fas fa-shopping-cart"></i>
              </div>
              <div>
                <div className="small text-gray-500">New Order</div>
                Order #12345 placed
              </div>
            </a>
            <a className="dropdown-item d-flex align-items-center" href="#">
              <div className="bg-success text-white rounded-circle me-3">
                <i className="fas fa-dollar-sign"></i>
              </div>
              <div>
                <div className="small text-gray-500">Payment</div>
                Payment received
              </div>
            </a>
            <a className="dropdown-item d-flex align-items-center" href="#">
              <div className="bg-warning text-white rounded-circle me-3">
                <i className="fas fa-user"></i>
              </div>
              <div>
                <div className="small text-gray-500">User</div>
                New user registered
              </div>
            </a>
            <a className="dropdown-item d-flex align-items-center" href="#">
              <div className="bg-info text-white rounded-circle me-3">
                <i className="fas fa-server"></i>
              </div>
              <div>
                <div className="small text-gray-500">Server</div>
                Server reboot
              </div>
            </a>
            <a className="dropdown-item text-center small text-gray-500" href="#">Show All Alerts</a>
          </div>
        </li>
        
        {/* Navbar Messages */}
        <li className="nav-item dropdown no-arrow mx-1">
          <a className="nav-link dropdown-toggle" href="#" id="messagesDropdown" role="button" data-bs-toggle="dropdown">
            <i className="fas fa-envelope fa-fw"></i>
            <span className="badge bg-danger rounded-pill">7 New!</span>
          </a>
          <div className="dropdown-list dropdown-menu dropdown-menu-end shadow" aria-labelledby="messagesDropdown">
            <h6 className="dropdown-header">
              Message Center
            </h6>
            <a className="dropdown-item d-flex align-items-center" href="#">
              <img className="rounded-circle me-3" src="https://via.placeholder.com/50x50/4e73df/ffffff?text=JD" alt="John Doe" />
              <div>
                <div className="text-truncate small">
                  <strong>John Doe</strong> just sent you a new message!
                </div>
              </div>
            </a>
            <a className="dropdown-item d-flex align-items-center" href="#">
              <img className="rounded-circle me-3" src="https://via.placeholder.com/50x50/e74a3b/ffffff?text=SM" alt="Sarah Miller" />
              <div>
                <div className="text-truncate small">
                  <strong>Sarah Miller</strong> has new feedback
                </div>
              </div>
            </a>
            <a className="dropdown-item d-flex align-items-center" href="#">
              <img className="rounded-circle me-3" src="https://via.placeholder.com/50x50/f39c12/ffffff?text=AB" alt="Alex Brown" />
              <div>
                <div className="text-truncate small">
                  <strong>Alex Brown</strong> wants to schedule a meeting
                </div>
              </div>
            </a>
            <a className="dropdown-item text-center small text-gray-500" href="#">Read More Messages</a>
          </div>
        </li>
        
        {/* User Dropdown */}
        <li className="nav-item dropdown">
          <a 
            className="nav-link dropdown-toggle" 
            id="navbarDropdown" 
            href="#" 
            role="button" 
            data-bs-toggle="dropdown" 
            aria-expanded="false"
          >
            <i className="fas fa-user fa-fw"></i>
            <span className="d-none d-lg-inline mx-1">{user?.name || user?.email}</span>
          </a>
          <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
            <li>
              <div className="dropdown-item d-flex align-items-center">
                <div className="dropdown-item-avatar">
                  <img className="rounded-circle me-3" src="https://via.placeholder.com/50x50/858796/ffffff?text=U" alt="User" />
                </div>
                <div>
                  <div className="fw-bold">{user?.name || user?.email}</div>
                  <div className="small text-gray-500">{user?.role || 'User'}</div>
                </div>
              </div>
            </li>
            <li><hr className="dropdown-divider" /></li>
            <li><Link className="dropdown-item" to="/dashboard/profile"><i className="fas fa-user fa-sm fa-fw me-2"></i>Profile</Link></li>
            <li><Link className="dropdown-item" to={user?.role === 'admin' ? '/admin/dashboard' : '/dashboard'}><i className="fas fa-tachometer-alt fa-sm fa-fw me-2"></i>Dashboard</Link></li>
            <li><Link className="dropdown-item" to="/dashboard"><i className="fas fa-cog fa-sm fa-fw me-2"></i>Settings</Link></li>
            <li><hr className="dropdown-divider" /></li>
            <li><button className="dropdown-item" onClick={logout}><i className="fas fa-sign-out-alt fa-sm fa-fw me-2"></i>Logout</button></li>
          </ul>
        </li>
      </ul>
    </nav>
  );
};

export default TopNav;

