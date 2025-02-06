import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/StationMap.css"; // Add CSS for styling

const stations = [
  { id: 1, name: "Station 1", lat: 10.01, lng: 76.10 },
  { id: 2, name: "Station 2", lat: 10.05, lng: 76.15 },
  { id: 3, name: "Station 3", lat: 10.10, lng: 76.20 },
];

const StationMap = () => {
  return (
    <div className="map-container">
      <h2>Nearby EV Charging Stations</h2>
      <MapContainer
        center={[10.0, 76.0]}
        zoom={10}
        style={{ height: "700px", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {stations.map((station) => (
          <Marker key={station.id} position={[station.lat, station.lng]}>
            <Popup>{station.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default StationMap;
