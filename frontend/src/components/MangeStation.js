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

  // Fetch stations from backend
  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    const response = await fetch("/api/stations");
    const data = await response.json();
    setStations(data);
  };

  // Handle form input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add a new station
  const handleAddStation = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/stations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      fetchStations(); // Refresh list after adding
      setFormData({ name: "", latitude: "", longitude: "", slots: "" });
    }
  };

  // Delete a station
  const handleDelete = async (id) => {
    await fetch(`/api/stations/${id}`, { method: "DELETE" });
    fetchStations(); // Refresh list after deleting
  };

  // Navigate to update page
  const handleUpdate = (id) => {
    navigate(`/update-station/${id}`);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Manage Charging Stations</h2>

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
  );
};

// Inline CSS Styles
const styles = {
  container: {
    textAlign: "center",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    marginBottom: "20px",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
    marginBottom: "20px",
  },
  input: {
    padding: "8px",
    width: "300px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  addButton: {
    background: "#007bff",
    color: "white",
    padding: "10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    width : "90%",
  },
  table: {
    width: "80%",
    margin: "auto",
    borderCollapse: "collapse",
  },
  updateButton: {
    backgroundColor: "#ffc107",
    color: "black",
    padding: "5px 10px",
    margin: "5px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    color: "white",
    padding: "5px 10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default ManageStations;
