import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import "../styles/ProfileEVuser.css";

const ProfilePageEV = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    profilePicture: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState("");
  
  
  useEffect(() => {
    fetchUserData();
  }, []);

  // Fetch user data from backend
  const fetchUserData = async () => {
    try {
      const response = await fetch(`http://localhost:5006/api/evuser/${user.id}`);
      const data = await response.json();
      setUserData(data);
      setPreview(data.profilePicture);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Handle Image Upload Preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log(file)
    if (file) {
      setSelectedImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Handle Profile Update
  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append("name", userData.name);
    formData.append("phoneNumber", userData.phoneNumber);
    if (selectedImage) {
      formData.append("profilePicture", selectedImage);
    }

    try {
      const response = await fetch(`http://localhost:5006/api/evuser/update/${user.id}`, {
        method: "PUT",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        alert("Profile updated successfully!");
        fetchUserData(); // Refresh user data
      } else {
        alert("Update failed.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
    
  };
  

  return (
    <div className="profile-container">
      <h2>Your Profile</h2>
      <div className="profile-card">
        <div className="profile-image">
        <img src={preview || `http://localhost:5006${userData.profilePicture}`} alt="Profile" />

          <input type="file" accept="image/*" onChange={handleImageChange} />
          

        </div>
        <div className="profile-details">
          <label>Name:</label>
          <input
            type="text"
            value={userData.name}
            onChange={(e) => setUserData({ ...userData, name: e.target.value })}
          />

          <label>Email:</label>
          <input type="email" value={userData.email} disabled />

          <label>Phone Number:</label>
          <input
            type="text"
            value={userData.phoneNumber}
            onChange={(e) => setUserData({ ...userData, phoneNumber: e.target.value })}
          />

          <button onClick={handleUpdate}>Update Profile</button>
          <button onClick={() => navigate("/evuserdashboard")} className="back-btn">
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePageEV;
