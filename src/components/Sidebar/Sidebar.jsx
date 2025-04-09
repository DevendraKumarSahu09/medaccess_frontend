import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const userType = localStorage.getItem('userType');
  const userId = localStorage.getItem('userId');

  const navItems = [
    { to: '/dashboard', icon: '📊', label: 'Dashboard' },
    { to: '/dashboard/hospitaldoctors', icon: '👨‍⚕️', label: 'Doctors' },
    { to: '/dashboard/beds', icon: '🛏️', label: 'Beds' },
    { to: '/dashboard/bloodbank', icon: '🩸', label: 'Blood Bank' },
    { to: '/dashboard/pharmacy', icon: '💊', label: 'Pharmacy' },
    { to: '/dashboard/nonmedicalstaff', icon: '👥', label: 'Staff' },
    { to: '/dashboard/editprofile', icon: '👤', label: 'Profile' },
    { to: '/', icon: '🏠', label: 'Main Site' }
  ];

  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-header">
        <h2>{userType === 'hospital' ? 'Hospital Admin' : 'Doctor Panel'}</h2>
      </div>

      <nav className="sidebar-nav">
        <ul>
          {navItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.to}
                className={`sidebar-link ${location.pathname === item.to ? 'active' : ''}`}
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span className="sidebar-label">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button className="logout-button" onClick={() => {
          localStorage.removeItem('token');
          localStorage.removeItem('userType');
          localStorage.removeItem('userId');
          window.location.href = '/login'; // Redirect to login after logout
        }}>
          <span className="sidebar-icon">🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
