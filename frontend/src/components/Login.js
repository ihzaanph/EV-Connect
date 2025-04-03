import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";
import { useUser } from "../context/UserContext";

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "evuser", // Default role
  });

  const {user,setUser}=useUser();

  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiUrl = isSignup
      ? "http://localhost:5006/users"
      : "http://localhost:5006/users/login";

    try {
      const response = await axios.post(apiUrl, formData);
      alert(isSignup ? "Signup successful! Please log in." : "Login successful!");

      if (!isSignup) {
        const userData = response.data.user; // Corrected response handling
        localStorage.setItem("userRole", userData.role);

        setUser({id:response.data.user.id,name:response.data.user.name , email: response.data.user.email, role:response.data.user.role})

        // Navigate based on user role
        if (userData.role === "evuser") {
          navigate("/ev-dashboard");
        } else if (userData.role === "admin") {
          navigate("/admin-dashboard");
        } else if (userData.role === "stationoperator") {
          navigate("/station-dashboard");
        } else {
          navigate("/station-dashboard"); // Default fallback
        }
      }
    } catch (error) {
      alert("Error: " + (error.response?.data?.message || "Something went wrong"));
    }
  };

  return (
    <div className="container">
      {/* Background Video */}
      <video autoPlay loop muted playsInline className="background-video">
        <source src="/video/evbackground1.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    {/* Logo */}
    <img src="../image/logo.png" alt="Logo" className="logo" />
      
      <div className="form-box">
        <h2>{isSignup ? "Sign Up" : "Login"}</h2>
        <form onSubmit={handleSubmit}>
          {isSignup && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="phoneNumber"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
              
              {/* Role Selection */}
              <div className="select-container">
                <label htmlFor="role">Select Role</label>
                <select name="role" value={formData.role} onChange={handleChange} required>
                  <option value="evuser">EV User</option>
                  <option value="stationoperator">Station Operator</option>
                </select>
              </div>
            </>
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit">{isSignup ? "Sign Up" : "Login"}</button>
        </form>
        <p onClick={() => setIsSignup(!isSignup)}>
          {isSignup ? "Already have an account? Login" : "Don't have an account? Sign up"}
        </p>
      </div>
    </div>
  );
};

export default Login;
