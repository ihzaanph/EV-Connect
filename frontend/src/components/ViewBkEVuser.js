import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import "../styles/ViewBkEVuser.css";

const ViewBookingEVUser = () => {
  const { user } = useUser();
  const [bookings, setBookings] = useState([]);
  const [showSecurityCode, setShowSecurityCode] = useState({});

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch(`http://localhost:5006/api/bookings/user/${user.id}`);
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  // Function to toggle Security Code visibility
  const toggleSecurityCode = (bookingId) => {
    setShowSecurityCode((prev) => ({
      ...prev,
      [bookingId]: !prev[bookingId],
    }));
  };

  // Function to cancel a booking
  const handleCancelBooking = async (bookingId) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this booking?");
    if (!confirmCancel) return;

    try {
      const response = await fetch(`http://localhost:5006/api/bookings/cancel/${bookingId}`, {
        method: "PUT",
      });

      if (response.ok) {
        alert("Booking canceled successfully!");
        fetchBookings(); // Refresh bookings
      } else {
        alert("Failed to cancel booking.");
      }
    } catch (error) {
      console.error("Error canceling booking:", error);
    }
  };

  // Convert Date to 12-Hour Format with AM/PM
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Separate Today's and Previous Bookings
  const today = new Date().setHours(0, 0, 0, 0); // Get today's date at midnight
  const todayBookings = bookings.filter(
    (booking) => new Date(booking.bookingDate).setHours(0, 0, 0, 0) === today
  );
  const previousBookings = bookings.filter(
    (booking) => new Date(booking.bookingDate).setHours(0, 0, 0, 0) < today
  );

  return (
    <div className="booking-list-container">
      <h2 className="hedd">Your Bookings</h2>

      {/* Today's Bookings */}
      {todayBookings.length > 0 && (
        <>
          <h3>Today's Bookings</h3>
          <table className="booking-table">
            <thead>
              <tr>
                <th>Station</th>
                <th>Slots</th>
                <th>Vehicle Type</th>
                <th>Amount (₹)</th>
                <th>Security Code</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Booking Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {todayBookings.map((booking) => (
                <tr key={booking._id}>
                  <td>{booking.chargingStation?.name || "Unknown"}</td>
                  <td>
                    {Array.isArray(booking.slot) ? (
                      booking.slot.map((slot, index) => (
                        <div key={index}>
                          {slot.from} - {slot.to}
                        </div>
                      ))
                    ) : (
                      <div>{booking.slot?.from} - {booking.slot?.to}</div>
                    )}
                  </td>
                  <td>{booking.vehicleType}</td>
                  <td>₹{booking.amount}</td>
                  <td>
                    <button
                      className="security-code-btn"
                      onClick={() => toggleSecurityCode(booking._id)}
                    >
                      {showSecurityCode[booking._id] ? booking.securityCode : "Show"}
                    </button>
                  </td>
                  <td>{booking.status}</td>
                  <td>{booking.paymentStatus}</td>
                  <td>{formatDate(booking.bookingDate)}</td>
                  <td>
                    {booking.status !== "cancelled" ? (
                      <button
                        className="cancel-btn"
                        onClick={() => handleCancelBooking(booking._id)}
                      >
                        Cancel
                      </button>
                    ) : (
                      <span className="cancelled-text">Cancelled</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* Previous Bookings */}
      {previousBookings.length > 0 && (
        <>
          <h3>Previous Bookings</h3>
          <table className="booking-table">
            <thead>
              <tr>
                <th>Station</th>
                <th>Slots</th>
                <th>Vehicle Type</th>
                <th>Amount (₹)</th>
                <th>Security Code</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Booking Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {previousBookings.map((booking) => (
                <tr key={booking._id}>
                  <td>{booking.chargingStation?.name || "Unknown"}</td>
                  <td>
                    {Array.isArray(booking.slot) ? (
                      booking.slot.map((slot, index) => (
                        <div key={index}>
                          {slot.from} - {slot.to}
                        </div>
                      ))
                    ) : (
                      <div>{booking.slot?.from} - {booking.slot?.to}</div>
                    )}
                  </td>
                  <td>{booking.vehicleType}</td>
                  <td>₹{booking.amount}</td>
                  <td>
                    <button
                      className="security-code-btn"
                      onClick={() => toggleSecurityCode(booking._id)}
                    >
                      {showSecurityCode[booking._id] ? booking.securityCode : "Show"}
                    </button>
                  </td>
                  <td>{booking.status}</td>
                  <td>{booking.paymentStatus}</td>
                  <td>{formatDate(booking.bookingDate)}</td>
                  <td>
                    {booking.status !== "cancelled" ? (
                      <button
                        className="cancel-btn"
                        onClick={() => handleCancelBooking(booking._id)}
                      >
                        Cancel
                      </button>
                    ) : (
                      <span className="cancelled-text">Cancelled</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* If no bookings exist */}
      {bookings.length === 0 && <p>No bookings found.</p>}
    </div>
  );
};

export default ViewBookingEVUser;
