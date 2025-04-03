import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import "../styles/Viewfeedback.css";

const ViewFeedbackOperator = () => {
  const { user } = useUser();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.id) {
      fetchFeedbacks();
    }
  }, [user?.id]);

  // Fetch Feedbacks for this Station Operator
  const fetchFeedbacks = async () => {
    try {
      console.log("Fetching feedback for operator:", user.id);

      const response = await fetch(`http://localhost:5006/api/operator/feedbacks/${user.id}`);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${await response.text()}`);
      }

      const data = await response.json();
      console.log("API Response:", data);

      setFeedbacks(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="mainn">
    <div className="feedback-container">
      <h2>Feedback for Your Charging Stations</h2>

      {loading ? (
        <p>Loading feedback...</p>
      ) : error ? (
        <p className="error">No feedback for your stations</p>
      ) : feedbacks.length > 0 ? (
        feedbacks.map((feedback) => (
          <div key={feedback._id} className="feedback-card">
            <h3>From: {feedback.userId?.name || "Unknown User"}</h3>
            <p><strong>Email:</strong> {feedback.userId?.email}</p>
            <p><strong>Feedback:</strong> {feedback.feedbackMessage}</p>
            <p><strong>Date:</strong> {new Date(feedback.createdAt).toLocaleString()}</p>
          </div>
        ))
      ) : (
        <p>No feedback found for your stations.</p>
      )}
    </div>
    </div>
  );
};

export default ViewFeedbackOperator;
