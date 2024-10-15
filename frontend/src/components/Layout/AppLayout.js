import React, { useState } from 'react';
import Sidebar from './Sidebar';
import UpperNavbar from './UpperNavbar';
import '../../css/App.css'; // Ensure you have a corresponding CSS file

const AppLayout = () => {
  const [isSidebarClosed, setIsSidebarClosed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarClosed(!isSidebarClosed);
  };

  return (
    <div className="dashboard-container">
      <UpperNavbar />
      <div className="main-layout">
        <Sidebar />
        <div className="main-content">
          <Outlet /> {/* This is where the routed components will be rendered */}
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
