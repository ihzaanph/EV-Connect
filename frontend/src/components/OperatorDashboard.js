import React from "react";
import { Link } from "react-router-dom";
import "../styles/StationOperatorDashboard.css";

const StationOperatorDashboard = ({ username }) => {
  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <nav className="sidebar">
        {/* Logo */}
        <img src="../image/logo.png" alt="Logo" className="logo" />   
        <ul>
          <li><Link to="/operator">Dashboard</Link></li>
          <li><Link to="/operator/manage-stations">Manage Stations</Link></li>
          <li><Link to="/operator/update-slots">Update Slot Availability</Link></li>
          <li><Link to="/operator/bookings">View Bookings</Link></li>
          <li><Link to="/operator/station-map">Station Map</Link></li>
          <li><Link to="/">Logout</Link></li>
        </ul>
      </nav>
      
      {/* Main Content */}
      <div className="main-content">
        <header>
          <h2>STATION OPERATOR DASHBOARD</h2>
          <p>Welcome {username}</p>
        </header>
        
        <div className="dashboard-cards">
          <div className="card">Total Stations: 5</div>
          <div className="card">Active Slots: 12</div>
          <div className="card">Pending Bookings: 3</div>
        </div>
      </div>
    </div>
  );
};

export default StationOperatorDashboard;

