import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate here
import MenuIcon from "../../assets/menu.svg"; // Ensure paths are correct
import DashboardIcon from "../../assets/grid.svg";
import TimetablesIcon from "../../assets/tt.svg";
import FeedbackIcon from "../../assets/feedback.svg";
import ReportsIcon from "../../assets/report.svg";
import SurveysIcon from "../../assets/survey.svg";
import AntiRaggingIcon from "../../assets/ragging.svg";
import RewardsIcon from "../../assets/reward.svg";
import SettingsIcon from "../../assets/facultyregistration.svg";
import LogoutIcon from "../../assets/log-out.svg";
import "../../css/Sidebar.css"; // Ensure path is correct

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate(); // Initialize navigate here

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login"); // Use navigate here
  };

  return (
    <nav
      className={`sidebar ${isOpen ? "open" : "closed"}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <header>
        <img
          className={`menu-toggle ${isOpen ? "rotate" : ""}`}
          src={MenuIcon}
          alt="Toggle menu"
          onClick={() => setIsOpen(!isOpen)}
        />
        <h1 className={`sidebar-title ${isOpen ? "" : "hideElement"}`}>RIAS</h1>
      </header>
      <div className="menu-links">
        <ul className="links-list">
          
          <li className="timetables-link">
            <Link to="/faculty-dashboard/faculty-timetable">
              <img className="icon" src={TimetablesIcon} alt="Timetables" />
              <span className={`${isOpen ? "" : "hideElement"}`}>
                Mapping Course
              </span>
            </Link>
          </li>
          <li className="timetables-link">
            <Link to="/faculty-dashboard/faculty-register">
              <img className="icon" src={ReportsIcon} alt="Timetables" />
              <span className={`${isOpen ? "" : "hideElement"}`}>
                Faculty Registration
              </span>
            </Link>
          </li>
          <li className="feedback-link">
            <Link to="/faculty-dashboard/Feedback">
              <img className="icon" src={FeedbackIcon} alt="Feedback" />
              <span className={`${isOpen ? "" : "hideElement"}`}>Edit Mapping</span>
            </Link>
          </li>
          
          
          <li className="anti-ragging-link">
            <Link to="/faculty-dashboard/users">
              <img className="icon" src={AntiRaggingIcon} alt="Anti-Ragging" />
              <span className={`${isOpen ? "" : "hideElement"}`}>
                Users
              </span>
            </Link>
          </li>
          

        </ul>
      </div>
      <div className="bottom-content">
        <div className={`developed-by ${isOpen ? "" : "hideElement"}`}>
          Developed by CSE Department
        </div>
        <img
          className="logout"
          src={LogoutIcon}
          alt="logout"
          onClick={handleLogout}
        />
      </div>
    </nav>
  );
};

export default Sidebar;
