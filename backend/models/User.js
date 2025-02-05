const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ["evuser", "admin", "stationoperator"], 
        default: "evuser" 
    }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
