import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import "../styles/givefeedback.css";

const FeedbackEVuser = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [stations, setStations] = useState([]);
  const [recipientType, setRecipientType] = useState("chargingStation");
  const [recipientId, setRecipientId] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");

  useEffect(() => {
    fetchStations();
  }, []);

  // Fetch all charging stations for dropdown
  const fetchStations = async () => {
    try {
      const response = await fetch("http://localhost:5006/api/charging-stations");
      const data = await response.json();
      setStations(data);
    } catch (error) {
      console.error("Error fetching stations:", error);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!recipientId || !feedbackMessage) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5006/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          recipientType,
          recipientId,
          feedbackMessage,
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert("Feedback submitted successfully!");
        setFeedbackMessage("");
      } else {
        alert("Failed to submit feedback.");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  return (
   <div className="mainn">
    <div className="feedbacks-container">
      <h2>Submit Feedback</h2>
      <form onSubmit={handleSubmit}>
        {/* Select Recipient */}
        <label>To:</label>
        <select
          value={recipientId}
          onChange={(e) => setRecipientId(e.target.value)}
        >
          <option value="">-- Select --</option>
          
          {stations.map((station) => (
            <option key={station._id} value={station.userId}>
              {station.name}
            </option>
          ))}
        </select>

        {/* Feedback Message */}
        <label>Feedback:</label>
        <textarea
          value={feedbackMessage}
          onChange={(e) => setFeedbackMessage(e.target.value)}
          placeholder="Write your feedback here..."
          required
        />

        {/* Submit Button */}
        <button type="submit" className="submit-btn">
          Submit Feedback
        </button>
      </form>
    </div>
  </div> 
  );
};

export default FeedbackEVuser;
