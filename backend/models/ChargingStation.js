const mongoose = require('mongoose');

// Charging Station Schema
const chargingStationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  slots: {
    type: Number,
    required: true,
  },
  availableSlots: {
    type: Number,
    required: true,
  },
  operationalStatus: {
    type: String,
    enum: ['active', 'inactive'], // 'active' or 'inactive'
    default: 'active',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ChargingStation = mongoose.model('ChargingStation', chargingStationSchema);

module.exports = ChargingStation;
