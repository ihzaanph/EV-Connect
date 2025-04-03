const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // User who gives the feedback
    required: true,
  },
  recipientType: {
    type: String,
    enum: ["chargingStation", "admin"], // Feedback for Station Operator or Admin
    required: true,
  },
  recipientId: {
    type: mongoose.Schema.Types.ObjectId, 
    refPath: "recipientType", // Dynamically references User or ChargingStation
    required: true,
  },
  feedbackMessage: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const Feedback = mongoose.model("Feedback", feedbackSchema);
module.exports = Feedback;
