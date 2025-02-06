const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // Import CORS
const ChargingStation = require("./models/ChargingStation");
const User = require("./models/User");
const Booking = require("./models/Booking");

const app = express();

// Middleware
app.use(express.json()); // Middleware to parse JSON
app.use(cors()); // Enable CORS for all requests

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/ev_connect")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// Default route


// User routes
// POST Register User
app.post("/users", async (req, res) => {
    const { name, email, phoneNumber, password, role } = req.body;

    // Ensure role is valid, default to "evuser"
    const validRoles = ["evuser", "admin", "stationoperator"];
    const userRole = validRoles.includes(role) ? role : "evuser";

    const newUser = new User({
        name,
        email,
        phoneNumber,
        password, // In production, use password hashing
        role: userRole
    });

    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json({ message: "Error registering user" });
    }
});


// ✅ POST Login User
app.post("/users/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user || user.password !== password) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        res.status(200).json({ 
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber,
                role: user.role 
            }
        });

    } catch (err) {
        res.status(500).json({ message: "Error logging in" });
    }
});


// 🚀 GET - Fetch all charging stations
app.get("/api/stations", async (req, res) => {
    try {
      const stations = await ChargingStation.find();
      res.json(stations);
    } catch (err) {
      res.status(500).json({ message: "Error fetching stations" });
    }
  });
  
  // 🚀 GET - Fetch single station by ID
  app.get("/api/stations/:id", async (req, res) => {
    try {
      const station = await ChargingStation.findById(req.params.id);
      if (!station) return res.status(404).json({ message: "Station not found" });
      res.json(station);
    } catch (err) {
      res.status(500).json({ message: "Error fetching station" });
    }
  });
  
  // 🚀 POST - Add a new charging station
  app.post("/api/stations", async (req, res) => {
    const { name, latitude, longitude, slots } = req.body;
  
    try {
      const newStation = new ChargingStation({
        name,
        latitude,
        longitude,
        slots,
        availableSlots: slots, // Initially, all slots are available
      });
  
      const savedStation = await newStation.save();
      res.status(201).json(savedStation);
    } catch (err) {
      res.status(500).json({ message: "Error adding station" });
    }
  });
  
  // 🚀 PUT - Update a charging station
  app.post("/api/stations/:id", async (req, res) => {
    try {
      const updatedStation = await ChargingStation.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.json(updatedStation);
    } catch (err) {
      res.status(500).json({ message: "Error updating station" });
    }
  });
  
  // 🚀 DELETE - Remove a charging station
  app.delete("/api/stations/:id", async (req, res) => {
    try {
      await ChargingStation.findByIdAndDelete(req.params.id);
      res.json({ message: "Station deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Error deleting station" });
    }
  });
  


// Listen on the specified port
const PORT = 5006;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
