import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import TopNav from './TopNav.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';

const DashboardLayout = () => {
  const [sidebarToggled, setSidebarToggled] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // Load sidebar toggle state from localStorage
    const toggled = localStorage.getItem('sb|sidebar-toggle') === 'true';
    setSidebarToggled(toggled);

    // Sidebar toggle handler
    const sidebarToggle = document.getElementById('sidebarToggle');
    if (sidebarToggle) {
      const toggleHandler = () => {
        setSidebarToggled(prev => {
          const newToggled = !prev;
          localStorage.setItem('sb|sidebar-toggle', newToggled);
          return newToggled;
        });
      };
      sidebarToggle.addEventListener('click', toggleHandler);
      return () => sidebarToggle.removeEventListener('click', toggleHandler);
    }
  }, []);

  return (
    <div className="sb-nav-fixed">
      <TopNav />
      <div id="layoutSidenav">
        <div id="layoutSidenav_nav">
          <Sidebar isToggled={sidebarToggled} />
        </div>
        <div id="layoutSidenav_content">
          <main>
            <div className="container-fluid px-4">
              <Outlet />
            </div>
          </main>
          <footer className="py-4 bg-light mt-auto">
            <div className="container-fluid px-4">
              <div className="d-flex align-items-center justify-content-between small">
                <div className="text-muted">Copyright © SmartStore Admin 2024</div>
                <div>
                  <a href="#">Privacy Policy</a>
                  ·
                  <a href="#">Terms &amp; Conditions</a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
