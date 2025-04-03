//current
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { useUser } from "../context/UserContext";
//Google API Key
const GOOGLE_MAPS_API_KEY = "AIzaSyAS9zfp0wdczlh-d1WDk1VHAbsTrhsDg-E";

const ManageStations = () => {
  const [stations, setStations] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    latitude: "",
    longitude: "",
    slots: "",
  });
  const {user} = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    fetchStations();
  }, []);


  

const fetchStations = () => {
  if (!user) return;

  fetch(`http://localhost:5006/api/stations?userId=${user.id}`)
    .then((response) => response.json())
    .then((data) => {
      console.log("Fetched Stations:", data);
      setStations(data); // 👈 Update state with user-specific stations
    })
    .catch((error) => console.error("Error fetching stations:", error));
};

  // 📌 Handle form input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 📌 Use Current Location for Latitude & Longitude
  const useCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setFormData({ ...formData, latitude: lat, longitude: lng });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  // 📌 Handle map click to update latitude & longitude
  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setFormData({ ...formData, latitude: lat, longitude: lng });
  };

  
  // 📌 Add a new station
const handleAddStation = async (e) => {
  e.preventDefault();
  
  if (!user) {
    alert("User ID is missing. Please log in again.");
    return;
  }
  console.log(user.id);
  const stationData = { ...formData, userId: user.id }; // 👈 Corrected user ID usage

  try {
    const response = await fetch("http://localhost:5006/api/stations/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(stationData),
    });

    if (response.ok) {
      fetchStations(); // Refresh the list
      setFormData({ name: "", latitude: "", longitude: "", slots: "" });
    }
  } catch (error) {
    console.error("Error adding station:", error);
  }
};


  // 📌 Delete a station
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5006/api/stations/${id}`, { method: "DELETE" });
      fetchStations();
    } catch (error) {
      console.error("Error deleting station:", error);
    }
  };

  // 📌 Navigate to update page
  const handleUpdate = (id) => {
    navigate(`/update-station/${id}`);
  };

  const handleEditSlots = (id) => {
    navigate(`/edit-slots/${id}`);
  };

  return (
    <div style={styles.container}>
      <header style={styles.header1} >
            <h2 style={styles.heading}>MANAGE CHARGING STATIONS</h2>
      </header>

            {/* Form for Adding Stations */}
            <form onSubmit={handleAddStation} style={styles.form}>
              <input type="text" name="name" placeholder="Station Name" value={formData.name} onChange={handleChange} required style={styles.input} />
              <input type="number" name="slots" placeholder="Total Slots" value={formData.slots} onChange={handleChange} required style={styles.input} />

              {/* Use Current Location Button */}
              <button type="button" onClick={useCurrentLocation} style={styles.locationButton}>
                📍 Use Current Location
              </button>

              {/* Map for Selecting Location */}
              <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
                <GoogleMap
                  mapContainerStyle={styles.mapContainer}
                  center={formData.latitude && formData.longitude ? { lat: formData.latitude, lng: formData.longitude } : { lat: 10.0, lng: 76.0 }}
                  zoom={10}
                  onClick={handleMapClick}
                >
                  {formData.latitude && formData.longitude && (
                    <Marker position={{ lat: formData.latitude, lng: formData.longitude }} />
                  )}
                </GoogleMap>
              </LoadScript>

              <p style={{ color: "white" }}>Selected Location: {formData.latitude}, {formData.longitude}</p>


              <button type="submit" style={styles.addButton}>Add Station</button>
            </form>
            &nbsp;
            &nbsp;

      {/* Table to Display Stations */}
    <header style={styles.header1} >
      <h2 style={styles.heading2}>STATION DETAILS </h2>
    </header>
      &nbsp;
      <div style={styles.tableContainer}>
        
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Latitude</th>
              <th style={styles.th}>Longitude</th>
              <th style={styles.th}>Slots</th>
              <th style={styles.th}></th>
              <th style={styles.th}>Actions</th>
              <th style={styles.th}></th>
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
                </td>
                <td>
                  <button onClick={() => handleDelete(station._id)} style={styles.deleteButton}>Delete</button>
                </td>
                <td>
                  <button onClick={() => handleEditSlots(station._id)} style={styles.editSlotsButton}>Edit Slots</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// 🎨 Styling Object
const styles = {
  container: {
    padding: "20px",
    textAlign: "center",
    backgroundImage: "url('../image/evbackground7.webp')",
    backgroundSize: "cover",
    backgroundAttachment: "fixed", 
    minHeight: "100vh",
    color: "#fff",
  },
  header1: {
    background: "rgba(255, 255, 255, 0.8)",
    padding: "10px",
    borderradius: "10px",
    boxshadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
    textalign: "center",
    marginbottom: "20px",
  },
  heading: {
    fontSize: "28px",
    marginBottom: "20px",
    color: "#000000",
  },
  heading2: {
    fontSize: "24px",
    marginBottom: "20px",
    color: "#000000",
  },
  form: {
    marginBottom: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  input: {
    width: "300px",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "5px",
    border: "none",
    fontSize: "16px",
  },
  locationButton: {
    padding: "5px 10px",
    width: "30%",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginBottom: "10px",
  },
  mapContainer: {
    height: "400px",
    width: "50%",
    borderRadius: "10px",
    marginBottom: "10px",
  },
  locationText: {
    fontSize: "16px",
    fontWeight: "bold",
    colour:"#ffffff",
  },
  addButton: {
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    width: "30%",
  },
  editSlotsButton: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "5px 10px",
    border: "none",
    cursor: "pointer",
    marginLeft: "5px",
  },
  
  tableContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: "20px",
  },
  table: {
    width: "80%",
    borderCollapse: "collapse",
    background: "#fff",
    color: "#000",
    borderRadius: "10px",
    marginTop: "20px",
    borderspacing: "30px",
  },
  th: {
    background: "#007bff",   // Header background color
    color: "white",
    padding: "10px",
    fontSize: "16px",
    borderBottom: "2px solid #ddd",
  },
  updateButton: {
    backgroundColor: "#4CAF50",
    color: "#fff",
    padding: "5px 10px",
    border: "none",
    cursor: "pointer",
  },
  deleteButton: {
    backgroundColor: "#f44336",
    color: "#fff",
    padding: "5px 10px",
    border: "none",
    cursor: "pointer",
  },
};

export default ManageStations;

//#4CAF50 BLUE green #4CAF50