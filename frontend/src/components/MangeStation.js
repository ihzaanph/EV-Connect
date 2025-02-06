import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ManageStations = () => {
  const [stations, setStations] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    latitude: "",
    longitude: "",
    slots: "",
  });

  const navigate = useNavigate();

  const styles = {
    container: {
      padding: "20px",
      textAlign: "center",
      backgroundImage: "url('../image/evbackground8.webp')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    contentContainer: {
      background: "rgba(255, 255, 255, 0.8)", // White with transparency
      padding: "30]px",
      borderRadius: "10px",
      width: "90%",
      maxWidth: "900px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    },
    heading: {
      fontSize: "28px",
      fontWeight: "bold",
      marginBottom: "15px",
      marginTop:"25px",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "10px",
      marginBottom: "20px",
    },
    input: {
      width: "300px",
      padding: "10px",
      fontSize: "16px",
    },
    addButton: {
      backgroundColor: "blue",
      color: "white",
      padding: "10px 10px",
      fontSize: "16px",
      border: "none",
      cursor: "pointer",
      width: "15%",
      marginBottom: "20px",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      marginTop: "20px",
    },
    updateButton: {
      backgroundColor: "blue",
      color: "white",
      padding: "5px 10px",
      border: "none",
      cursor: "pointer",
      marginRight: "10px",
      marginBottom: "10px",
    },
    deleteButton: {
      backgroundColor: "red",
      color: "white",
      padding: "5px 10px",
      border: "none",
      cursor: "pointer",
      marginBottom: "10px",
    },
  };

  useEffect(() => {
    fetchStations();
  }, []);

  // Fetch stations from backend
  const fetchStations = async () => {
    try {
      const response = await fetch("http://localhost:5006/api/stations");
      const data = await response.json();
      setStations(data);
    } catch (error) {
      console.error("Error fetching stations:", error);
    }
  };

  // Handle form input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add a new station
  const handleAddStation = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5006/api/stations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchStations(); // Refresh list after adding
        setFormData({ name: "", latitude: "", longitude: "", slots: "" });
      }
    } catch (error) {
      console.error("Error adding station:", error);
    }
  };

  // Delete a station
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5006/api/stations/${id}`, { method: "DELETE" });
      fetchStations(); // Refresh list after deleting
    } catch (error) {
      console.error("Error deleting station:", error);
    }
  };

  // Navigate to update page
  const handleUpdate = (id) => {
    navigate(`/update-station/${id}`);
  };

  return (
    <div style={styles.container}>
      <div style={styles.contentContainer}>
        <h2 style={styles.heading}>MANAGE CHARGING STATIONS</h2>

        {/* Add Station Form */}
        <form onSubmit={handleAddStation} style={styles.form}>
          <input type="text" name="name" placeholder="Station Name" value={formData.name} onChange={handleChange} required style={styles.input} />
          <input type="number" name="latitude" placeholder="Latitude" value={formData.latitude} onChange={handleChange} required style={styles.input} />
          <input type="number" name="longitude" placeholder="Longitude" value={formData.longitude} onChange={handleChange} required style={styles.input} />
          <input type="number" name="slots" placeholder="Total Slots" value={formData.slots} onChange={handleChange} required style={styles.input} />
          <button type="submit" style={styles.addButton}>Add Station</button>
        </form>

        {/* Station List */}
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Latitude</th>
              <th>Longitude</th>
              <th>Slots</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {stations.map((station) => (
              <tr key={station._id}>
                <td>{station.name}</td>
                <td>{station.latitude}</td>
                <td>{station.longitude}</td>
                <td>{station.slots}</td>
                <td>
                  <button onClick={() => handleUpdate(station._id)} style={styles.updateButton}>Update</button>
                  <button onClick={() => handleDelete(station._id)} style={styles.deleteButton}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageStations;
