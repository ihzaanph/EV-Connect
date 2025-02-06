import React, { useEffect, useState } from "react";
import { FaSearchLocation } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Import navigation
import "../styles/EVUserDashboard.css"; // CSS for styling

const EVUserDashboard = () => {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate(); // React Router Navigation

  // Fetch user name from local storage or API
  useEffect(() => {
    const storedUser = localStorage.getItem("userName") || "Guest";
    setUserName(storedUser);
  }, []);

  // Function to navigate to the StationMap page
  const handleSearchClick = () => {
    navigate("/stationmap");
  };

  return (
    <div className="dashboard-container">
      
      {/* Header Section */}
      <div className="header">
        {/* Logo */}
        <img src="../image/logo.png" alt="Logo" className="logo" />
        <h1>EV User</h1>
        <h3>Welcome, {userName}!</h3>
      </div>

      {/* Search Button */}
      <button className="search-btn" onClick={handleSearchClick}>
        <FaSearchLocation className="icon" /> Search Station Nearby
      </button>
    </div>
  );
};

export default EVUserDashboard;
