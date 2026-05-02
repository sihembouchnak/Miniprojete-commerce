import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';

const Sidebar = ({ isToggled }) => {
  const { user } = useAuth();
  const location = useLocation();
  const isAdmin = user?.role === 'admin';

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const adminNavGroups = [
    {
      heading: 'Core',
      items: [
        { icon: 'fas fa-tachometer-alt', label: 'Dashboard', to: '/admin/dashboard' },
      ]
    },
    {
      heading: 'Interface',
      items: [
        { icon: 'fas fa-chart-area', label: 'Charts', to: '/admin/charts' },
        { icon: 'fas fa-table', label: 'Tables', to: '/admin/tables' },
      ]
    },
    {
      heading: 'Addons',
      items: [
        { icon: 'fas fa-boxes', label: 'Products', to: '/admin/products' },
        { icon: 'fas fa-shopping-cart', label: 'Orders', to: '/admin/orders' },
        { icon: 'fas fa-users', label: 'Users', to: '/admin/users' },
      ]
    }
  ];

  const userNavGroups = [
    {
      heading: 'Core',
      items: [
        { icon: 'fas fa-tachometer-alt', label: 'Dashboard', to: '/dashboard' },
        { icon: 'fas fa-shopping-cart', label: 'My Orders', to: '/dashboard/orders' },
      ]
    },
    {
      heading: 'Utilities',
      items: [
        { icon: 'fas fa-user', label: 'Profile', to: '/dashboard/profile' },
        { icon: 'fas fa-chart-bar', label: 'Analytics', to: '/dashboard/analytics' },
        { icon: 'fas fa-headset', label: 'Support', to: '/dashboard/support' },
      ]
    }
  ];

  const navGroups = isAdmin ? adminNavGroups : userNavGroups;

  return (
    <nav className={`sb-sidenav accordion sb-sidenav-dark ${isToggled ? 'sb-sidenav-toggled' : ''}`} id="sidenavAccordion">
      <div className="sb-sidenav-menu">
        <div className="nav">
          {navGroups.map((group) => (
            <React.Fragment key={group.heading}>
              <div className="sb-sidenav-menu-heading">{group.heading}</div>
              {group.items.map((item) => (
                <Link
                  key={item.label}
                  className={`nav-link ${isActive(item.to) ? 'active' : ''}`}
                  to={item.to}
                >
                  <div className="sb-nav-link-icon">
                    <i className={item.icon}></i>
                  </div>
                  {item.label}
                </Link>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
      
      <div className="sb-sidenav-footer">
        <div className="small">Logged in as:</div>
        {user?.name || user?.email || 'User'}
      </div>
    </nav>
  );
};

export default Sidebar;

