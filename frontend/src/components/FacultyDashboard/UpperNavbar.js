import React from "react";
import { useNavigate } from "react-router-dom";
import ProfileIcon from "../../assets/profile-icon.svg";
import LogoutIcon from "../../assets/log-out.svg";
import SearchIcon from "../../assets/search.svg";
import Csv from "../../assets/csv.svg";
import "./css/UpperNavbar.css";

const UpperNavbar = ({ isClosed }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <nav className={`upper-navbar ${isClosed ? "closed" : ""}`}>
      <div className="navbar-left">
        <div className="logo">
          <span className="navbar-title">
            <b>RIAS</b>
          </span>
        </div>
      </div>
      <div className="navbar-right">


      <a href="/faculty-dashboard/faculty-csv" className="profile-link">
          <img src={Csv} alt="Profile" className="nav-icon" style={{ width: "50px", height: "50px" }}/>
        </a>
        <a href="/faculty-dashboard/F-profile" className="profile-link">
          <img src={ProfileIcon} alt="Profile" className="nav-icon" style={{ width: "30px", height: "50px" }} />
        </a>

        <img
          src={LogoutIcon}
          alt="Logout"
          className="nav-icon"
          onClick={handleLogout}
          style={{ width: "30px", height: "50px" }}
        />
      </div>
    </nav>
  );
};

export default UpperNavbar;
