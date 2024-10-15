import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import './css/dashboard.css'; // Ensure the CSS file path is correct

const Adashboard = () => {
  return (
    <div className="admin-dashboard-layout">
      <Sidebar />
      <div className="admin-dashboard-container">
        
        <div className="admin-dashboard-cards">
          {[
            { title: "Branch Feedback Analysis", link: "/admin-dashboard/Department-Analysis", buttonText: "View Timetables" },
            { title: "Same Subject Feedback Analysis", link: "/admin-dashboard/samesubject", buttonText: "View Feedback" },
            { title: "Same Faculty, Different Subjects Feedback Analysis", link: "/admin-dashboard/samefaculty", buttonText: "View Reports" },
            { title: "Feedback Statistics", link: "/admin-dashboard/Stats", buttonText: "View Surveys" },
            { title: "Feedback Statistics in Graphs", link: "/admin-dashboard/adminchart", buttonText: "View Charts" },
            { title: "Student Feedback View", link: "/admin-dashboard/Feedback", buttonText: "View Feedback" },
            { title: "Users", link: "/admin-dashboard/adminuser", buttonText: "Manage Users" },
            { title: "Profile", link: "/student-dashboard/profile", buttonText: "View Profile" },
            { title: "CSV Upload", link: "/admin-dashboard/admin-csv", buttonText: "Upload CSV" }
          ].map(({ title, link, buttonText }, index) => (
            <div className="admin-dashboard-card" key={index}>
              <h2>{title}</h2>
              <p>This is the card content.</p>
              <Link to={link}>
                <button className="admin-dashboard-button">{buttonText}</button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Adashboard;