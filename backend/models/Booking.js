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
  slot: {
    type: String, // Slot number or time
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
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
