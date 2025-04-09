import React from 'react';
import './layout.css';
import Sidebar from '../components/Sidebar/Sidebar';

const DashLayout = ({ children }) => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <Sidebar />
        <main className="dashboard-main">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashLayout;
