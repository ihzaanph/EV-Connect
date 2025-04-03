import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/Booking.css";
import { useUser } from "../context/UserContext";

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [slots, setSlots] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [vehicleType, setVehicleType] = useState("2W"); // Default selection
  const {user} = useUser();
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Booking rates per slot
  const bookingRates = {
    "2W": 20,
    "3W": 30,
    "4W": 40,
    "HV": 50,
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  // Fetch Available Slots for the Selected Station
  const fetchSlots = async () => {
    try {
      const response = await fetch(`http://localhost:5006/api/bookingslot/${id}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch slots");
      }
  
      const data = await response.json();
  
      // Filter slots based on operationalStatus === true
      const availableSlots = Array.isArray(data) ? data.filter(slot => slot.operationalStatus) : [];
  
      setSlots(availableSlots);
      console.log("Fetched Available Slots:", availableSlots);
    } catch (error) {
      console.error("Error fetching slots:", error);
    }
  };

  // Convert 24-hour format (HH:MM) to 12-hour format with AM/PM
  const convertTo12HourFormat = (time) => {
    const [hour, minute] = time.split(":").map(Number);
    const period = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12; // Convert 0 to 12 for 12AM
    return `${formattedHour}:${minute.toString().padStart(2, "0")} ${period}`;
  };

  // Handle Slot Selection
  const handleSlotSelection = (slotId) => {
    setSelectedSlots((prevSelected) =>
      prevSelected.includes(slotId)
        ? prevSelected.filter((id) => id !== slotId)
        : [...prevSelected, slotId]
    );
  };

  // Calculate Total Price
  const totalPrice = selectedSlots.length * bookingRates[vehicleType];

// Handle Booking
  const handleBooking = async () => {
    if (selectedSlots.length === 0) {
      alert("Please select at least one slot.");
      return;
    }

    const totalAmount = selectedSlots.length * bookingRates[vehicleType]; // Calculate amount

    const bookingDetails = {
      uid: user.id,  // User ID
      id,  // Charging Station ID
      slots: selectedSlots,  // Slot IDs (array)
      vehicleType,  // Vehicle type (2W, 3W, 4W, HV)
      amount: totalAmount, // Total booking amount
      status: "confirmed",
      paymentStatus: "paid",
    };

    try {
      const paymentLoaded = await loadRazorpay();

      if (!paymentLoaded) {
        alert("Razorpay SDK failed to load. Are you online?");
        return;
      }

      const response = await fetch("http://localhost:5006/api/bookings/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalAmount,
          currency: "INR",
          receipt: `receipt_${Date.now()}`,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        alert("Payment initiation failed. Try again.");
        return;
      }

      const options = {
        key: "rzp_test_x6tFo25SjkJqdk",
        amount: data.order.amount,
        currency: data.order.currency,
        name: "EV Connect",
        description: "Charging Slot Booking",
        order_id: data.order.id,
        handler: async (response) => {
          alert("Payment successful!");

          // Update Booking Status
          const confirmResponse = await fetch("http://localhost:5006/api/bookings/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              uid: user.id,
              id,
              slots: selectedSlots,
              vehicleType,
              amount: totalPrice,
              status: "confirmed",
              paymentStatus: "paid",
              paymentId: response.razorpay_payment_id, // Store Razorpay Payment ID
            }),
          });

          if (confirmResponse.ok) {
            alert("Booking confirmed!");
            window.location.reload(); // Reload the page
          } else {
            alert("Booking update failed.");
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: "7025721681",
        },
        theme: { color: "#3399cc" },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Error during booking:", error);
      alert("Something went wrong.");
    }
  };

  

  return (
  <div className="mainbooking">
    <div className="booking-container">
      <h2>Book Charging Slot</h2>

      {/* Vehicle Type Selection */}
      <label htmlFor="vehicle-type">Select Vehicle Type:</label>
      <select
        id="vehicle-type"
        value={vehicleType}
        onChange={(e) => setVehicleType(e.target.value)}
      >
        <option value="2W">2 Wheeler</option>
        <option value="3W">3 Wheeler</option>
        <option value="4W">4 Wheeler</option>
        <option value="HV">Heavy Vehicle</option>
      </select>

      {/* Booking Rate Table */}
      <table className="rate-table">
        <thead>
          <tr>
            <th>Vehicle Type</th>
            <th>Booking Charge (₹/Slot)</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>2 Wheeler</td><td>₹20</td></tr>
          <tr><td>3 Wheeler</td><td>₹30</td></tr>
          <tr><td>4 Wheeler</td><td>₹40</td></tr>
          <tr><td>Heavy Vehicle</td><td>₹50</td></tr>
        </tbody>
      </table>

      {/* Disclaimer */}
      <p className="disclaimer">
        * This is only a booking charge. The remaining amount must be paid at the charging station.
      </p>

      {/* Slot Selection */}
      <h3 className="slot-heading">Available Slots</h3>
      <div className="slots-container">
        {slots.length > 0 ? (
          <div className="slots-grid">
            {slots.map((slot) => (
              <div key={slot._id} className={`slot-card ${slot.operationalStatus === "available" ? "available" : "not-available"}`}>
                <div className="slot-details">
                  <span className="slot-time">
                    {convertTo12HourFormat(slot.from)} - {convertTo12HourFormat(slot.to)}
                  </span>
                  <p className="slot-status">
                    {slot.operationalStatus === "available" ? "🟢 Available" : "🔴 Not Available"}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={selectedSlots.includes(slot._id)}
                  onChange={() => handleSlotSelection(slot._id)}
                  className="slot-checkbox"
                  disabled={slot.operationalStatus !== "available"}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="no-slots">No available slots.</p>
        )}
      </div>


      {/* Total Price & Book Now Button */}
      <div className="total-price">
        <strong>Total Price: ₹{totalPrice}</strong>
      </div>
      <button className="book-now-btn" onClick={handleBooking}>Book Now</button>
    </div>
    </div>
  );
};

export default BookingPage;

