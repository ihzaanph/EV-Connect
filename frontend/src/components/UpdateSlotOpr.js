import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import "../styles/UpdateSlotOpr.css";

const UpdateSlot = () => {
  const { user } = useUser();
  const [stationsWithSlots, setStationsWithSlots] = useState([]);

  useEffect(() => {
    fetchSlots();
  }, []);

  // Fetch slots for the operator
  const fetchSlots = async () => {
    try {
      const response = await fetch(`http://localhost:5006/api/operator/slots/${user.id}`);
      const data = await response.json();
      setStationsWithSlots(data);
    } catch (error) {
      console.error("Error fetching slots:", error);
    }
  };

  // Convert 24-hour time format (HH:MM) to 12-hour format with AM/PM
  const convertTo12HourFormat = (time) => {
    const [hour, minute] = time.split(":").map(Number);
    const period = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12; // Convert 0 to 12 for 12AM
    return `${formattedHour}:${minute.toString().padStart(2, "0")} ${period}`;
  };

  // Toggle Slot Availability
  const toggleSlotStatus = async (slotId, currentStatus) => {
    const newStatus = currentStatus === "available" ? "notavailable" : "available";

    try {
      const response = await fetch(`http://localhost:5006/api/slots/update/${slotId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationalStatus: newStatus }),
      });

      if (response.ok) {
        alert("Slot status updated successfully!");
        fetchSlots(); // Refresh slot data
      } else {
        alert("Failed to update slot status.");
      }
    } catch (error) {
      console.error("Error updating slot status:", error);
    }
  };

  return (
    <div className="update-main-container">
        <div className="update-slot-container">
          <h2>MANAGE SLOTS</h2>

          {stationsWithSlots.length > 0 ? (
            stationsWithSlots.map((station) => (
              <div key={station.stationId} className="station-section">
                <h3>{station.stationName}</h3>
                <table className="slot-table">
                  <thead>
                    <tr>
                      <th>Time Slot</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {station.slots.map((slot) => (
                      <tr key={slot._id}>
                        <td>{convertTo12HourFormat(slot.from)} - {convertTo12HourFormat(slot.to)}</td>
                        <td className={slot.operationalStatus === "available" ? "available" : "notavailable"}>
                          {slot.operationalStatus}
                        </td>
                        <td>
                          <button
                            className={`toggle-btn ${slot.operationalStatus}`}
                            onClick={() => toggleSlotStatus(slot._id, slot.operationalStatus)}
                          >
                            {slot.operationalStatus === "available" ? "Make Not Available" : "Make Available"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
        ))
      ) : (
        <p>No slots available for your stations.</p>
      )}
    </div>
  </div>
  );
};

export default UpdateSlot;
