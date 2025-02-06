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


// Listen on the specified port
const PORT = 5006;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
