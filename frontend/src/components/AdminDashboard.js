import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminDashboard.css"; // Import styles
import { useUser } from "../context/UserContext";

const AdminDashboard = () => {
  const {user} =useUser();
  const [evUsers, setEvUsers] = useState([]);
  const [stationOperators, setStationOperators] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:5006/api/admin/users");
      const data = await response.json();
      setEvUsers(data.evUsers);
      setStationOperators(data.stationOperators);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Delete user
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await fetch(`http://localhost:5006/api/admin/delete/${id}`, {
          method: "DELETE",
        });
        setEvUsers(evUsers.filter((user) => user._id !== id));
        setStationOperators(stationOperators.filter((user) => user._id !== id));
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>ADMIN DASHBOARD</h2>

      {/* Station Operators Section */}
      <h3>STATION OPERATOR</h3>
      <p>Welcome {user.name}</p>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {stationOperators.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.phoneNumber}</td>
              <td>
                <button className="delete-btn" onClick={() => handleDelete(user._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* EV Users Section */}
      <h3>EV Users</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {evUsers.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.phoneNumber}</td>
              <td>
                <button className="delete-btn" onClick={() => handleDelete(user._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Single See Requests Button at the Bottom */}
      <div className="see-requests-container">
        <button className="see-requests-btn" onClick={() => navigate("/admin/requests")}>
          See Requests
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
