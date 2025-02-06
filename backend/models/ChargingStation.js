const mongoose = require('mongoose');

// Charging Station Schema
const chargingStationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
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

});

const ChargingStation = mongoose.model('ChargingStation', chargingStationSchema);

module.exports = ChargingStation;
