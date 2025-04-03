import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import "../styles/UpdateStation.css";

// Google Maps API Key
const GOOGLE_MAPS_API_KEY = "AIzaSyAS9zfp0wdczlh-d1WDk1VHAbsTrhsDg-E";

const UpdateStation = () => {
  const { id } = useParams(); // Get station ID from URL
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    latitude: "",
    longitude: "",
    slots: "",
  });

  useEffect(() => {
    fetchStationDetails();
  }, []);

  // 📌 Fetch the current station details
  const fetchStationDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5006/api/stations}`);
      const data = await response.json();
      setFormData({
        name: data.name,
        latitude: data.latitude,
        longitude: data.longitude,
        slots: data.slots,
      });
    } catch (error) {
      console.error("Error fetching station details:", error);
    }
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

  // 📌 Handle station update
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:5006/api/stations/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Station updated successfully!");
        navigate("/manage-stations"); // Redirect back to Manage Stations
      } else {
        alert("Failed to update station.");
      }
    } catch (error) {
      console.error("Error updating station:", error);
    }
  };

  return (
  <div className="mainn">
    <div className="update-container">
      <h2>Update Charging Station</h2>
      <form onSubmit={handleUpdate} className="update-form">
        <input type="text" name="name" placeholder="Station Name" value={formData.name} onChange={handleChange} required />
        <input type="number" name="slots" placeholder="Total Slots" value={formData.slots} onChange={handleChange} required />

        {/* Use Current Location Button */}
        <button type="button" onClick={useCurrentLocation} className="location-btn">
          📍 Use Current Location
        </button>

        {/* Google Map for Selecting Location */}
        <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={["places"]}>

          <GoogleMap
            mapContainerClassName="map-container"
            center={formData.latitude && formData.longitude ? { lat: parseFloat(formData.latitude), lng: parseFloat(formData.longitude) } : { lat: 10.0, lng: 76.0 }}
            zoom={10}
            onClick={handleMapClick}
          >
            {formData.latitude && formData.longitude && (
              <Marker position={{ lat: parseFloat(formData.latitude), lng: parseFloat(formData.longitude) }} />
            )}
          </GoogleMap>
        </LoadScript>

        <p>Selected Location: {formData.latitude}, {formData.longitude}</p>

        <button type="submit" className="update-btn">Update Station</button>
      </form>
    </div>
    </div>
  );
};

export default UpdateStation;
