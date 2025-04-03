const mongoose = require('mongoose');

// Booking Schema
const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Refers to the User model
    required: true,
  },
  chargingStation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChargingStation', // Refers to the ChargingStation model
    required: true,
  },
  slot: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Slot', // Allow multiple slots
      required: true,
    }
  ],
  vehicleType: {
    type: String,
    required: true,
  },
  amount: {
    type: Number, // Stores total payment amount
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'], // Status of the booking
    default: 'pending',
  },
  bookingDate: {
    type: Date,
    default: Date.now,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending',
  },
  securityCode: {
    type: Number, // 6-digit security code for booking verification
    required: true,
  },
  paymentId: {
    type: String, // Store Razorpay payment ID
    required: true,
  }
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
