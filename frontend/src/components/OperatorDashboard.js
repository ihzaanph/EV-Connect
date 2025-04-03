import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/StationOperatorDashboard.css";
import { useUser } from "../context/UserContext";

const StationOperatorDashboard = () => {
  const { user } = useUser();
  const [stats, setStats] = useState({
    totalStations: 0,
    totalSlots: 0,
    activeSlots: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.id) {
      fetchStats();
    }
  }, [user?.id]);

  const fetchStats = async () => {
    try {
      const response = await fetch(`http://localhost:5006/api/operator/stats/${user.id}`);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${await response.text()}`);
      }

      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching station stats:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <nav className="sidebar">
        <img src="../image/logo.png" alt="Logo" className="logo" />
        <ul>
          {/*<li><Link to="/operator/profile">Profile</Link></li>*/}
          <li><Link to="/operator/manage-stations">Manage Stations</Link></li>
          <li><Link to="/operator/update-slots">Update Slot Availability</Link></li>
          <li><Link to="/operator/feedback">View Feedback</Link></li>
          <li><Link to="/operator/bookings">View Booking</Link></li>
          <li><Link to="/">Logout</Link></li>
        </ul>
      </nav>

      {/* Main Content */}
      <div className="main-content">
        <header>
          <h2>STATION OPERATOR DASHBOARD</h2>
          <p>Welcome {user.name}</p>
        </header>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <div className="dashboard-cards">
            <div className="card">Total Stations: {stats.totalStations}</div>
            <div className="card">Active Slots: {stats.activeSlots}</div>
            <div className="card">Total Slots: {stats.totalSlots}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StationOperatorDashboard;
