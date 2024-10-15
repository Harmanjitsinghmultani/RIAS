import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import MenuIcon from "../assets/menu.svg";
import DashboardIcon from "../assets/grid.svg";
import TimetablesIcon from "../assets/tt.svg";
import FeedbackIcon from "../assets/feedback.svg";
import ReportsIcon from "../assets/report.svg";
import SurveysIcon from "../assets/survey.svg";
import AntiRaggingIcon from "../assets/ragging.svg";
import RewardsIcon from "../assets/reward.svg";
import SettingsIcon from "../assets/settings.svg";
import LogoutIcon from "../assets/log-out.svg";
import "../css/Sidebar.css";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
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
          alt="menu"
          onClick={() => setIsOpen(!isOpen)}
        />
        <h1 className={`sidebar-title ${isOpen ? "" : "hideElement"}`}>RIAS</h1>
      </header>
      <div className="menu-links">
        <ul className="links-list">
          {/* 
<li className="timetables-link">
  <Link to="/student-dashboard/timetable">
    <img className="icon" src={TimetablesIcon} alt="timetables" />
    <span className={`${isOpen ? "" : "hideElement"}`}>
      Timetables
    </span>
  </Link>
</li> 
*/}

          <li className="timetables-link">
            <Link to="/student-dashboard/elective">
              <img className="icon" src={TimetablesIcon} alt="timetables" />
              <span className={`${isOpen ? "" : "hideElement"}`}>
                Select Elective
              </span>
            </Link>
          </li>
          <li className="feedback-link">
            <Link to="/student-dashboard/Feedback">
              <img className="icon" src={FeedbackIcon} alt="feedback" />
              <span className={`${isOpen ? "" : "hideElement"}`}>Feedback</span>
            </Link>
          </li>
          <li className="anti-ragging-link">
            <Link to="/student-dashboard/Antiragging">
              <img className="icon" src={AntiRaggingIcon} alt="anti-ragging" />
              <span className={`${isOpen ? "" : "hideElement"}`}>
                Anti-Ragging
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
