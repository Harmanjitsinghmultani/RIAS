import React from 'react';
import { Outlet } from 'react-router-dom';
import UpperNavbar from '../UpperNavbar';
import Sidebar from '../Sidebar'; // Ensure this path is correct
import styles from './CSS/DashboardLayout.module.css'; // Import CSS module

const DashboardLayout = ({ children }) => {
  return (
    <div className={styles.dashboardContainer}>
      <UpperNavbar />
      <div className={styles.mainLayout}>
        <Sidebar />
        <div className={styles.mainContent}>
          {children}
          <Outlet /> {/* This will render the nested routes */}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
