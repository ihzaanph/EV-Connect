import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const UpdateStation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    latitude: "",
    longitude: "",
    slots: "",
  });

  useEffect(() => {
    fetch(`http://localhost:5006/api/stations/${id}`)
      .then((res) => res.json())
      .then((data) => setFormData(data));
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    await fetch(`http://localhost:5006/api/stations/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    navigate("/operator/manage-stations");
  };

  // Internal CSS styles
  const styles = {
    container: {
      backgroundImage: "url('../image/evbackground8.webp')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px",
    },
    contentContainer: {
      background: "rgba(255, 255, 255, 0.85)", // Semi-transparent white
      padding: "30px",
      borderRadius: "10px",
      width: "80%",
      maxWidth: "500px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      textAlign: "center",
    },
    heading: {
      fontSize: "24px",
      fontWeight: "bold",
      marginBottom: "20px",
      color: "black",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "15px",
    },
    input: {
      width: "100%",
      padding: "10px",
      fontSize: "16px",
      border: "1px solid #ccc",
      borderRadius: "5px",
    },
    updateButton: {
      backgroundColor: "#28a745",
      color: "white",
      padding: "10px",
      fontSize: "16px",
      border: "none",
      cursor: "pointer",
      borderRadius: "5px",
      width: "100%",
      transition: "background 0.3s",
    },
    updateButtonHover: {
      backgroundColor: "#218838",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.contentContainer}>
        <h2 style={styles.heading}>UPDATE CHARGING STATION</h2>
        <form onSubmit={handleUpdate} style={styles.form}>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={styles.input}
            placeholder="Station Name"
          />
          <input
            type="number"
            name="latitude"
            value={formData.latitude}
            onChange={handleChange}
            required
            style={styles.input}
            placeholder="Latitude"
          />
          <input
            type="number"
            name="longitude"
            value={formData.longitude}
            onChange={handleChange}
            required
            style={styles.input}
            placeholder="Longitude"
          />
          <input
            type="number"
            name="slots"
            value={formData.slots}
            onChange={handleChange}
            required
            style={styles.input}
            placeholder="Total Slots"
          />
          <button
            type="submit"
            style={styles.updateButton}
            onMouseOver={(e) => (e.target.style.backgroundColor = styles.updateButtonHover.backgroundColor)}
            onMouseOut={(e) => (e.target.style.backgroundColor = styles.updateButton.backgroundColor)}
          >
            Update Station
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateStation;
