import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/NearByStations.css";

const NearbyStations = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [stations, setStations] = useState([]);
  const [nearbyStations, setNearbyStations] = useState([]);
  const navigate = useNavigate();
  const RADIUS_KM = 5; // Search radius for nearby stations

  useEffect(() => {
    getUserLocation();
  }, []);

  // Get User's Current Location (Forces fresh location fetch)
  const getUserLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          fetchStations(latitude, longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Please enable location services.");
        },
        { enableHighAccuracy: true } // Ensures fresh location data
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  // Fetch Charging Stations from Database
  const fetchStations = async (userLat, userLng) => {
    try {
      const response = await fetch("http://localhost:5006/api/stations/view");
      const data = await response.json();
      setStations(data);

      // Filter Nearby Stations & Include Distance
      const filteredStations = data
        .map((station) => {
          const distance = parseFloat(
            calculateDistance(userLat, userLng, station.latitude, station.longitude).toFixed(3)
          );
          return { ...station, distance }; // Add distance to the station object
        })
        .filter((station) => station.distance <= RADIUS_KM);

      setNearbyStations(filteredStations);
    } catch (error) {
      console.error("Error fetching stations:", error);
    }
  };

  // Haversine Formula to Calculate Distance Between Two Coordinates
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (angle) => (angle * Math.PI) / 180;
    const R = 6371; // Earth’s radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in km
  };

  // Handle Booking Button Click
  const handleBook = (stationId) => {
    navigate(`/book/${stationId}`);
  };

  // Handle Direction Button Click (Now includes the correct "from" location)
  const handleDirection = (latitude, longitude) => {
    if (!userLocation) {
      alert("User location not available. Please enable location services.");
      return;
    }

    const { latitude: userLat, longitude: userLng } = userLocation;
    window.open(
      `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${latitude},${longitude}`,
      "_blank"
    );
  };

  return (
    <div className="main-container">
      <div className="nearby-stations-container">
        <h2>Nearby Charging Stations</h2>
        {userLocation ? (
          <p>Your Location: {userLocation.latitude}, {userLocation.longitude}</p>
        ) : (
          <p>Fetching location...</p>
        )}

        <ul className="stations-list">
          {nearbyStations.length > 0 ? (
            nearbyStations.map((station) => (
              <li key={station._id} className="station-item">
                <div className="station-info">
                  <strong>{station.name} - {station.distance.toFixed(3)} km away</strong> 
                </div>
                <div className="station-buttons">
                  <button className="direction-btnn" onClick={() => handleDirection(station.latitude, station.longitude)}>
                    ➜ Directions
                  </button>
                  <button className="book-btn" onClick={() => handleBook(station._id)}>Book</button>
                </div>
              </li>
            ))
          ) : (
            <p>No charging stations found within {RADIUS_KM} km.</p>
          )}
        </ul>
      </div>
    </div>
  );
 };

export default NearbyStations;
