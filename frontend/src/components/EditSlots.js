import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../styles/EditSlot.css";

const EditSlots = () => {
  const { id } = useParams();
  const [station, setStation] = useState({ name: "Demo Station", slots: 5 }); // Dummy data
  const [showSlotForm, setShowSlotForm] = useState(false);
  const [slotTimes, setSlotTimes] = useState([]);
  const [formData, setFormData] = useState({ from: "", to: "" });

  useEffect(() => {
    fetchStation();
    fetchSlotTimes();
  }, []);

  // Fetch station details
  const fetchStation = async () => {
    try {
      const response = await fetch(`http://localhost:5006/api/slot/stations/fetch/${id}`);
      const data = await response.json();
      setStation(data);
    } catch (error) {
      console.error("Error fetching station details:", error);
    }
  };

  // Fetch existing slot times and convert them to 12-hour format
  const fetchSlotTimes = async () => {
    try {
      const response = await fetch(`http://localhost:5006/api/slots/${id}`);
      const data = await response.json();

      const formattedSlots = data.map((slot) => ({
        _id: slot._id, // Include slot ID for deletion
        from: convertTo12Hour(slot.from),
        to: convertTo12Hour(slot.to),
      }));

      setSlotTimes(formattedSlots);
    } catch (error) {
      console.error("Error fetching slot times:", error);
    }
  };

  // Convert 24-hour time to 12-hour format
  const convertTo12Hour = (time) => {
    const [hour, minute] = time.split(":");
    let hours = parseInt(hour, 10);
    let period = "AM";

    if (hours >= 12) {
      period = "PM";
      if (hours > 12) hours -= 12;
    } else if (hours === 0) {
      hours = 12;
    }

    return `${hours}:${minute} ${period}`;
  };

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add slot time to database
  const handleAddSlot = async () => {
    if (slotTimes.length >= station.slots) {
      alert("You have reached the maximum number of slots.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5006/api/stations/slots/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({ from: "", to: "" });
        setShowSlotForm(false);
        fetchSlotTimes();
      }
    } catch (error) {
      console.error("Error adding slot:", error);
    }
  };

  // Delete slot
  const handleDeleteSlot = async (slotId) => {
    try {
      const response = await fetch(`http://localhost:5006/api/stations/delete/slots/${slotId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setSlotTimes(slotTimes.filter((slot) => slot._id !== slotId));
      }
    } catch (error) {
      console.error("Error deleting slot:", error);
    }
  };

  return (
    <div className="edit-slots-container">
      <h2 className="hee">EDIT SLOTS</h2>

      <div className="station-details">
        <p><strong>Station Name:</strong> {station.name}</p>
        <p><strong>Number of Slots: </strong> {station.slots}</p>
      </div>

      <button className="add-slot-btn" onClick={() => setShowSlotForm(true)}>
        ➕ Add Station Slot
      </button>

      {showSlotForm && (
        <div className="slot-form">
          <input type="time" name="from" value={formData.from} onChange={handleChange} required />
          <input type="time" name="to" value={formData.to} onChange={handleChange} required />
          <button className="submit-btn" onClick={handleAddSlot}>Add</button>
        </div>
      )}

      <h3 className="slots-header">Added Slots</h3>
      <ul className="slots-list">
        {slotTimes.map((slot) => (
          <li key={slot._id}>
            {slot.from} - {slot.to}
            <button className="delete-btn" onClick={() => handleDeleteSlot(slot._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EditSlots;
