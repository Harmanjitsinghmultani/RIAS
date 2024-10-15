import React from 'react';
import { Outlet } from 'react-router-dom';
import UpperNavbar from './UpperNavbar';
import Sidebar from './Sidebar'; // Ensure this path is correct
import './css/DashboardLayout.css'; // Add styles for layout

const AdminDashboard = ({ children }) => {
    return (
      <div className="dashboard-container">
        <UpperNavbar />
        <div className="main-layout">
          <Sidebar />
          <div className="main-content">
            {children}
            <Outlet /> {/* This will render the nested routes */}
          </div>
        </div>
      </div>
    );
  };

export default AdminDashboard;
