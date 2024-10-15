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
import SettingsIcon from "../../assets/settings.svg";
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
          <li className="dashboard-link">
            <Link to="/student-dashboard">
              <img className="icon" src={DashboardIcon} alt="Dashboard" />
              <span className={`${isOpen ? "" : "hideElement"}`}>
                Dashboard
              </span>
            </Link>
          </li>
          <li className="timetables-link">
            <Link to="/student-dashboard/timetable">
              <img className="icon" src={TimetablesIcon} alt="Timetables" />
              <span className={`${isOpen ? "" : "hideElement"}`}>
                Timetables
              </span>
            </Link>
          </li>
          <li className="feedback-link">
            <Link to="/student-dashboard/Feedback">
              <img className="icon" src={FeedbackIcon} alt="Feedback" />
              <span className={`${isOpen ? "" : "hideElement"}`}>Feessdback</span>
            </Link>
          </li>
          <li className="reports-link">
            <Link to="/student-dashboard/profile">
              <img className="icon" src={ReportsIcon} alt="Reports" />
              <span className={`${isOpen ? "" : "hideElement"}`}>Reports</span>
            </Link>
          </li>
          <li className="surveys-link">
            <Link to="/student-dashboard/Surveystu">
              <img className="icon" src={SurveysIcon} alt="Surveys" />
              <span className={`${isOpen ? "" : "hideElement"}`}>Surveys</span>
            </Link>
          </li>
          <li className="anti-ragging-link">
            <Link to="/student-dashboard/anti-ragging">
              <img className="icon" src={AntiRaggingIcon} alt="Anti-Ragging" />
              <span className={`${isOpen ? "" : "hideElement"}`}>
                Anti-Ragging
              </span>
            </Link>
          </li>
          <li className="rewards-link">
            <Link to="/student-dashboard/rewards">
              <img className="icon" src={RewardsIcon} alt="Rewards" />
              <span className={`${isOpen ? "" : "hideElement"}`}>Rewards</span>
            </Link>
          </li>
          <li className="settings-link">
            <Link to="/student-dashboard/settings">
              <img className="icon" src={SettingsIcon} alt="Settings" />
              <span className={`${isOpen ? "" : "hideElement"}`}>Settings</span>
            </Link>
          </li>
        </ul>
      </div>
      <div className="bottom-content">
        <img
          className="logout"
          src={LogoutIcon}
          alt="Logout"
          onClick={handleLogout}
        />
      </div>
    </nav>
  );
};

export default Sidebar;
