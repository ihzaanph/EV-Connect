
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext";
import "../styles/ProfileOpr.css";

const StationOperatorProfile = () => {
  const { user } = useUser();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    profilePicture: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);

  // Fetch user profile
  useEffect(() => {
    axios.get(`/api/operator/profile/${user._id}`)
      .then((response) => setProfile(response.data))
      .catch((error) => console.error("Error fetching profile:", error));
  }, [user._id]);

  // Handle input changes
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // Handle image selection
  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  // Update Profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", profile.name);
    formData.append("email", profile.email);
    formData.append("phoneNumber", profile.phoneNumber);
    if (selectedImage) {
      formData.append("profilePicture", selectedImage);
    }

    try {
      const response = await axios.put(`/api/operator/profile/${user._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProfile(response.data);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  return (
    <div className="profile-container">
      <h2>Station Operator Profile</h2>
      <img src={profile.profilePicture || "https://via.placeholder.com/150"} alt="Profile" className="profile-pic" />
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input type="text" name="name" value={profile.name} onChange={handleChange} required />
        
        <label>Email:</label>
        <input type="email" name="email" value={profile.email} onChange={handleChange} required />

        <label>Phone Number:</label>
        <input type="text" name="phoneNumber" value={profile.phoneNumber} onChange={handleChange} required />

        <label>Profile Picture:</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />

        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default StationOperatorProfile;
