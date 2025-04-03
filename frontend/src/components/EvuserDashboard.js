import React, { useState } from "react";
import { FaSearchLocation, FaBars } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../styles/EVUserDashboard.css";
import { useUser } from "../context/UserContext";

const EVUserDashboard = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Navigation Functions
  const handleSearchClick = () => navigate("/stationmap");
  const handleViewBooking = () => navigate("/viewbookingevuser");
  const handleProfile = () => navigate("/profile");
  const handleViewStations = () => navigate("/viewstations");
  const handleFeedback = () => navigate("/feedback");
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      {/* Header with Dropdown */}
      <header className="dashboard-header">
        <h1>EV User Dashboard</h1>
        <div className="dropdown">
          <button className="dropdown-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
            <FaBars />
          </button>
          {dropdownOpen && (
            <div className="dropdown-content">
              {/*<button onClick={handleProfile}>Profile</button>*/}
              <button onClick={handleViewStations}>View Stations</button>
              <button onClick={handleFeedback}>Feedback</button>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
          )}
        </div>
      </header>
      <h1 className="welcome">Welcome {user.name}</h1>
        <div>
          
        </div>

      {/* Centered Buttons */}
      <div className="center-content">
        <button className="action-btn" onClick={handleSearchClick}>
          <FaSearchLocation className="icon" />
          Search Nearby Stations
        </button>
        <button className="action-btn" onClick={handleViewBooking}>
          View Booking
        </button>
      </div>
    </div>
  );
};

export default EVUserDashboard;
