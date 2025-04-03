import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "../styles/ViewstaEVuser.css";

const ViewStations = () => {
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const navigate = useNavigate(); // For navigation

  useEffect(() => {
    fetchStations();
    getUserLocation();
  }, []);

  // Fetch Charging Stations
  const fetchStations = async () => {
    try {
      const response = await fetch("http://localhost:5006/api/charging-stations-evuser");
      const data = await response.json();
      setStations(data);
    } catch (error) {
      console.error("Error fetching stations:", error);
    }
  };

  // Get User's Current Location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  // Open Google Maps for Directions
  const openGoogleMaps = (lat, lng) => {
    if (userLocation) {
      const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${lat},${lng}&travelmode=driving`;
      window.open(url, "_blank");
    } else {
      alert("Unable to get your location.");
    }
  };

  // Navigate to Booking Page
  const goToBookingPage = (stationId) => {
    navigate(`/book/${stationId}`); // Navigate to the booking page of the selected station
  };

  return (
    <div className="view-stations-container">
      <h2 className="hedd">Find Nearby Charging Stations</h2>
      <div className="map-box">
        <LoadScript googleMapsApiKey="AIzaSyAS9zfp0wdczlh-d1WDk1VHAbsTrhsDg-E">
          <GoogleMap
            mapContainerClassName="map-container"
            center={userLocation || { lat: 10.0, lng: 76.0 }} // Default center if user location is unavailable
            zoom={10}
          >
            {/* User's Location Marker */}
            {userLocation && (
              <Marker
                position={userLocation}
                icon={{
                  url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                  scaledSize: { width: 40, height: 40 },
                }}
              />
            )}

            {/* Charging Station Markers */}
            {stations.map((station) => (
              <Marker
                key={station._id}
                position={{ lat: station.latitude, lng: station.longitude }}
                onClick={() => setSelectedStation(station)}
              />
            ))}

            {/* Info Window for Selected Station */}
            {selectedStation && (
              <InfoWindow
                position={{ lat: selectedStation.latitude, lng: selectedStation.longitude }}
                onCloseClick={() => setSelectedStation(null)}
              >
                <div className="info-window">
                  <h4>{selectedStation.name}</h4>
                  <p>Status: <span className={selectedStation.operationalStatus === "active" ? "active" : "inactive"}>
                    {selectedStation.operationalStatus}
                  </span></p>
                  <button
                    className="direction-btn"
                    onClick={() => openGoogleMaps(selectedStation.latitude, selectedStation.longitude)}
                  >
                    Get Directions
                  </button>
                  <button
                    className="book-btn"
                    onClick={() => goToBookingPage(selectedStation._id)}
                  >
                    Book Now
                  </button>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
};

export default ViewStations;
