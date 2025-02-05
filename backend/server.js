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


// Booking routes
// POST Create Booking
app.post("/bookings", async (req, res) => {
    const { userId, chargingStationId, slot } = req.body;

    const newBooking = new Booking({
        user: userId,
        chargingStation: chargingStationId,
        slot,
        status: "Pending" // Default status is "Pending"
    });

    try {
        const savedBooking = await newBooking.save();
        res.status(201).json(savedBooking);
    } catch (err) {
        res.status(500).json({ message: "Error creating booking" });
    }
});

// GET All Bookings (for a specific user)
app.get("/bookings/:userId", async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.params.userId }).populate("chargingStation");
        res.status(200).json(bookings);
    } catch (err) {
        res.status(500).json({ message: "Error fetching bookings" });
    }
});

// Update Booking Status (Confirm, Cancel, etc.)
app.put("/bookings/:bookingId", async (req, res) => {
    try {
        const booking = await Booking.findByIdAndUpdate(req.params.bookingId, req.body, { new: true });
        res.status(200).json(booking);
    } catch (err) {
        res.status(500).json({ message: "Error updating booking" });
    }
});

// Listen on the specified port
const PORT = 5006;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
