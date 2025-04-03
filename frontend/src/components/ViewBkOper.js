import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import "../styles/ViewBkOper.css";

const ViewBookingsOperator = () => {
  const { user } = useUser();
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchDate, setSearchDate] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  // Fetch bookings for operator's stations
  const fetchBookings = async () => {
    try {
      const response = await fetch(`http://localhost:5006/api/operator/bookings/${user.id}`);
      const data = await response.json();
      setBookings(data);
      setFilteredBookings(data); // Initialize filtered bookings
    } catch (error) {
      console.error("Error fetching bookings:", error);
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

  // Handle Date Filter
  const handleSearch = () => {
    if (!searchDate) {
      setFilteredBookings(bookings);
      return;
    }
    const filtered = bookings.filter((booking) => {
      const bookingDate = new Date(booking.bookingDate).toISOString().split("T")[0];
      return bookingDate === searchDate;
    });
    setFilteredBookings(filtered);
  };

  // Group bookings by charging station
  const groupBookingsByStation = (bookingsList) => {
    return Object.entries(
      bookingsList.reduce((acc, booking) => {
        const stationName = booking.chargingStation?.name || "Unknown";
        if (!acc[stationName]) acc[stationName] = [];
        acc[stationName].push(booking);
        return acc;
      }, {})
    );
  };

  // Separate bookings into today's and previous bookings
  const today = new Date().toISOString().split("T")[0];
  const todaysBookings = filteredBookings.filter(
    (booking) => new Date(booking.bookingDate).toISOString().split("T")[0] === today
  );
  const previousBookings = filteredBookings.filter(
    (booking) => new Date(booking.bookingDate).toISOString().split("T")[0] !== today
  );

  return (
    <div className="operator-booking-container">
      <h2>Bookings for Your Charging Stations</h2>

      {/* Date Filter */}
      <div className="filter-section">
        <label>Select Date:</label>
        <input
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
        />
        <button className="book" onClick={handleSearch}>Search</button>
      </div>

      {/* Today's Bookings */}
      <h4>Today's Bookings</h4>
      {todaysBookings.length > 0 ? (
        groupBookingsByStation(todaysBookings).map(([stationName, stationBookings]) => (
          <div key={stationName} className="station-section">
            <h3>{stationName}</h3>
            <table className="booking-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Slot</th>
                  <th>Vehicle Type</th>
                  <th>Amount (₹)</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Booking Date</th>
                  <th>Security Code</th>
                </tr>
              </thead>
              <tbody>
                {stationBookings.map((booking) => (
                  <tr key={booking._id}>
                    <td>{booking.user?.name || "Unknown"}</td>
                    <td>
                      {booking.slot.map((slot, index) => (
                        <div key={index}>
                          {slot.from} - {slot.to}
                        </div>
                      ))}
                    </td>
                    <td>{booking.vehicleType}</td>
                    <td>₹{booking.amount}</td>
                    <td>{booking.status}</td>
                    <td>{booking.paymentStatus}</td>
                    <td>{formatDate(booking.bookingDate)}</td>
                    <td>{booking.securityCode}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      ) : (
        <p>No bookings for today.</p>
      )}

      {/* Previous Bookings */}
      <h4>Previous Bookings</h4>
      {previousBookings.length > 0 ? (
        groupBookingsByStation(previousBookings).map(([stationName, stationBookings]) => (
          <div key={stationName} className="station-section">
            <h3>{stationName}</h3>
            <table className="booking-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Slot</th>
                  <th>Vehicle Type</th>
                  <th>Amount (₹)</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Booking Date</th>
                  <th>Security Code</th>
                </tr>
              </thead>
              <tbody>
                {stationBookings.map((booking) => (
                  <tr key={booking._id}>
                    <td>{booking.user?.name || "Unknown"}</td>
                    <td>
                      {booking.slot.map((slot, index) => (
                        <div key={index}>
                          {slot.from} - {slot.to}
                        </div>
                      ))}
                    </td>
                    <td>{booking.vehicleType}</td>
                    <td>₹{booking.amount}</td>
                    <td>{booking.status}</td>
                    <td>{booking.paymentStatus}</td>
                    <td>{formatDate(booking.bookingDate)}</td>
                    <td>{booking.securityCode}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      ) : (
        <p>No previous bookings.</p>
      )}
    </div>
  );
};

export default ViewBookingsOperator;
