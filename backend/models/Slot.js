const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema({
  stationId: { type: mongoose.Schema.Types.ObjectId, ref: "Station", required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  operationalStatus: {
    type: String,
    enum: ['available', 'notavailable'], // 'active' or 'inactive'
    default: 'available',
  },
});

module.exports = mongoose.model("Slot", slotSchema);
