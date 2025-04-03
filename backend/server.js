//current
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // Import CORS
const ChargingStation = require("./models/ChargingStation");
const User = require("./models/User");
const Slot = require("./models/Slot");
const Booking = require("./models/BookingDetails");
const Feedback = require("./models/Feedback");
const razorpay = require("./config/razorpay");
const router = express.Router();
const multer = require("multer");
const path = require("path");


const app = express();

// Middleware
app.use("/uploads", express.static("uploads"));
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



  
  // 🚀 GET - Fetch single station by ID - manages station
  app.get("/api/stations", async (req, res) => {
    try {
      const { userId } = req.query; // 👈 Get userId from query parameters
  
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
  
      const stations = await ChargingStation.find({ userId }); // 👈 Fetch stations only for that user
      res.status(200).json(stations);
    } catch (error) {
      res.status(500).json({ message: "Error fetching stations", error });
    }
  });

  
  // 🚀 POST - Add a new charging station - manage station
  app.post("/api/stations/add", async (req, res) => {
    const { name, latitude, longitude, slots , userId } = req.body;
    console.log(userId);

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
  
    try {
      const newStation = new ChargingStation({
        name,
        latitude,
        longitude,
        slots,
        availableSlots: slots, // Initially, all slots are available
        userId// Store the station operator ID
      });
  
      const savedStation = await newStation.save();
      res.status(201).json(savedStation);
    } catch (err) {
      res.status(500).json({ message: "Error adding station" });
    }
  });
  
  // 🚀 PUT - Update a charging station - manage station
  app.put("/api/stations/update/:id", async (req, res) => {
    const { id } = req.params;
    const { name, latitude, longitude, slots } = req.body;

    try {
      const updatedStation = await ChargingStation.findByIdAndUpdate(id, { name, latitude, longitude, slots }, { new: true });
      if (!updatedStation) {
        return res.status(404).json({ message: "Station not found" });
      }
      res.json(updatedStation);
    } catch (error) {
      console.error("Error updating station:", error);
      res.status(500).json({ message: "Internal Server Error" });
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
  

  // Add a new slot
  app.post("/api/stations/slots/:id", async (req, res) => {
    try {
      const { from, to } = req.body;
      const slot = new Slot({ stationId: req.params.id, from, to });
      await slot.save();
      res.status(201).json(slot);
    } catch (error) {
      res.status(500).json({ error: "Failed to add slot" });
    }
  });

  // Get slots for a station
  app.get("/api/slots/:id", async (req, res) => {
    try {
      const slots = await Slot.find({ stationId: req.params.id });
      res.json(slots);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch slots" });
    }
  });



  app.get("/api/slot/stations/fetch/:id", async (req, res) => {
    try {
      console.log(req.params.id);
       // 👈 Get userId from query parameters
  
      if (!req.params.id) {
        return res.status(400).json({ message: "User ID is required" });
      }
      userI = req.params.id;
      const stations = await ChargingStation.findOne({ _id: userI }); 
// 👈 Fetch stations only for that user
      console.log(stations);
      res.status(200).json(stations);
    } catch (error) {
      res.status(500).json({ message: "Error fetching stations", error });
    }
  });

  // Delete a slot
    app.delete("/api/stations/delete/slots/:slotId", async (req, res) => {
      try {
        await Slot.findByIdAndDelete(req.params.slotId);
        res.json({ message: "Slot deleted successfully" });
      } catch (error) {
        res.status(500).json({ error: "Error deleting slot" });
      }
    });


  // Fetch all charging stations
    app.get("/api/stations/view", async (req, res) => {
      try {
        const stations = await ChargingStation.find(); // Fetch stations from MongoDB
        res.json(stations);
      } catch (error) {
        console.error("Error fetching stations:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    // Fetch all users, categorized by role tp (admin dash)
    app.get("/api/admin/users", async (req, res) => {
      try {
        const evUsers = await User.find({ role: "evuser" });
        const stationOperators = await User.find({ role: "stationoperator" });
        res.json({ evUsers, stationOperators });
      } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

// Delete a user from (admin dash)
    app.delete("/api/admin/delete/:id", async (req, res) => {
      try {
        const { id } = req.params;
        await User.findByIdAndDelete(id);
        res.json({ message: "User deleted successfully" });
      } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

// Fetch available slots for a given station for booking (ev user dash)
  app.get("/api/bookingslot/:id", async (req, res) => {
    try {
      const stationId = req.params.id;
      if (!stationId) {
        return res.status(400).json({ message: "Station ID is required" });
      }

      // Fetch all slots for the given stationId
      const slots = await Slot.find({ stationId: stationId }, "from to operationalStatus"); // Added operationalStatus

      if (!slots.length) {
        return res.status(404).json({ message: "No slots found for this station" });
      }

      res.status(200).json(slots);
    } catch (error) {
      console.error("Error fetching slots:", error);
      res.status(500).json({ message: "Error fetching slots", error });
    }
  });

//razorpay(ev user dash)
  app.post("/api/bookings/create-order", async (req, res) => {
    try {
      const { amount, currency = "INR", receipt } = req.body;
  
      const options = {
        amount: amount * 100, // Convert to paise
        currency,
        receipt,
      };
  
      const order = await razorpay.orders.create(options);
      res.json({ success: true, order });
    } catch (error) {
      console.error("Error creating Razorpay order:", error);
      res.status(500).json({ success: false, message: "Failed to create order" });
    }
  });


// Update Booking Status (EV User Dashboard)
  app.post("/api/bookings/create", async (req, res) => {
    try {
        const { uid, id, slots, vehicleType, amount, status, paymentStatus, paymentId } = req.body;

        // Generate a random 6-digit security code
        const securityCode = Math.floor(100000 + Math.random() * 900000);

        // Create a new booking
        const newBooking = new Booking({
            user: uid,
            chargingStation: id,
            slot: slots, // Store slot ID(s)
            vehicleType,
            amount,
            status,
            paymentStatus,
            securityCode, // Store generated security code
            paymentId,  // Store Razorpay Payment ID
        });

        await newBooking.save();

        // 🔄 Update slot status to 'notavailable' after successful booking
        await Slot.updateMany(
            { _id: { $in: slots } }, // Find all selected slots
            { $set: { operationalStatus: "notavailable" } } // Update their status
        );

        res.json({ success: true, message: "Booking saved successfully.", securityCode, paymentId });

    } catch (error) {
        console.error("Error saving booking:", error);
        res.status(500).json({ success: false, message: "Failed to save booking" });
    }
  });


  
//view booking (evuser)

app.get("/api/bookings/user/:userId", async (req, res) => {
  try {
      const userId = req.params.userId;

      const bookings = await Booking.find({ user: userId })
          .populate("chargingStation", "name") // Populate charging station name
          .populate("slot", "from to") // Populate slot timings (from & to)
          .select("vehicleType amount securityCode status bookingDate paymentStatus"); // Include additional fields

      res.status(200).json(bookings);
  } catch (error) {
      console.error("Error fetching user bookings:", error);
      res.status(500).json({ message: "Error fetching bookings" });
  }
});

  

// 🚀 Cancel Booking Route(ev user)


app.put("/api/bookings/cancel/:bookingId", async (req, res) => {
    try {
        const { bookingId } = req.params;

        const booking = await Booking.findById(bookingId).populate("slot");
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        if (booking.paymentStatus !== "paid") {
            return res.status(400).json({ message: "Payment has not been made for this booking" });
        }

        // Initiate refund via Razorpay
        const refund = await razorpay.payments.refund(booking.paymentId, {
            amount: booking.amount * 100, // Razorpay expects amount in paise
        });

        if (!refund.id) {
            return res.status(500).json({ message: "Refund failed" });
        }

        // Update Booking Status
        booking.status = "cancelled";
        booking.paymentStatus = "refunded";
        await booking.save();

        // Update Slot Operational Status
        await Slot.updateMany(
            { _id: { $in: booking.slot } },
            { $set: { operationalStatus: "available" } }
        );

        res.json({ message: "Booking cancelled and refunded successfully" });
    } catch (error) {
        console.error("Error cancelling booking:", error);
        res.status(500).json({ message: "Failed to cancel booking" });
    }
});
//Fetch Slots for a (Station Operator) to update slot
app.get("/api/operator/slots/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Find all charging stations belonging to the station operator
    const stations = await ChargingStation.find({ userId });

    if (!stations.length) {
      return res.status(404).json({ message: "No stations found for this operator" });
    }

    // Fetch all slots for the operator's stations
    const slots = await Slot.find({ stationId: { $in: stations.map(station => station._id) } });

    // Organize slots under their respective stations
    const response = stations.map(station => ({
      stationId: station._id,
      stationName: station.name,
      slots: slots.filter(slot => slot.stationId.toString() === station._id.toString()),
    }));

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching operator slots:", error);
    res.status(500).json({ message: "Error fetching slots", error });
  }
});

//Update Slot Status(station operator)
app.put("/api/slots/update/:slotId", async (req, res) => {
  try {
    const { slotId } = req.params;
    const { operationalStatus } = req.body;

    // Validate status
    if (!["available", "notavailable"].includes(operationalStatus)) {
      return res.status(400).json({ message: "Invalid operational status" });
    }

    // Update slot status
    const updatedSlot = await Slot.findByIdAndUpdate(slotId, { operationalStatus }, { new: true });

    if (!updatedSlot) {
      return res.status(404).json({ message: "Slot not found" });
    }

    res.json({ success: true, message: "Slot status updated successfully", slot: updatedSlot });
  } catch (error) {
    console.error("Error updating slot status:", error);
    res.status(500).json({ message: "Error updating slot status", error });
  }
});

//view station (EV User)
app.get("/api/charging-stations-evuser", async (req, res) => {
  try {
    const stations = await ChargingStation.find({});
    res.json(stations);
  } catch (error) {
    console.error("Error fetching stations:", error);
    res.status(500).json({ message: "Failed to fetch stations" });
  }
});


// Configure Multer for Image Upload(EV User)
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Fetch User Data(ev user)
app.get("/api/evuser/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user data" });
  }
});

// Update User Profile (EV User)
app.put("/api/evuser/update/:id", upload.single("profilePicture"), async (req, res) => {
  try {
    const { name, phoneNumber } = req.body;
    let updatedData = { name, phoneNumber };

    if (req.file) {
      updatedData.profilePicture = `/uploads/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updatedData, { new: true });

    if (!updatedUser) return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, message: "Profile updated successfully", updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating profile" });
  }
});

// view bookings(station operators)
app.get("/api/operator/bookings/:operatorId", async (req, res) => {
  try {
    const { operatorId } = req.params;

    // Find stations owned by this operator
    const stations = await ChargingStation.find({ userId: operatorId });

    if (!stations.length) {
      return res.status(404).json({ message: "No stations found for this operator" });
    }

    // Extract station IDs
    const stationIds = stations.map(station => station._id);

    // Find bookings for these stations
    const bookings = await Booking.find({ chargingStation: { $in: stationIds } })
      .populate("user", "name email") // Get user details
      .populate("chargingStation", "name") // Get station name
      .populate("slot", "from to"); // Get slot timing

    res.json(bookings);
  } catch (error) {
    console.error("Error fetching operator bookings:", error);
    res.status(500).json({ message: "Error fetching bookings" });
  }
});
 


// Fetch all charging stations for dropdown
app.get("/api/charging-stations", async (req, res) => {
  try {
    const stations = await ChargingStation.find({}, "name userId");
    res.json(stations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching stations" });
  }
});

// Submit Feedback (EV USER)
app.post("/api/feedback", async (req, res) => {
  try {
    const { userId, recipientType, recipientId, feedbackMessage } = req.body;

    if (!userId || !recipientType || !recipientId || !feedbackMessage) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newFeedback = new Feedback({ userId, recipientType, recipientId, feedbackMessage });
    await newFeedback.save();

    res.json({ success: true, message: "Feedback submitted successfully" });

  } catch (error) {
    console.error("Error submitting feedback:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Fetch Feedbacks for Station Operator
app.get("/api/operator/feedbacks/:operatorId", async (req, res) => {
  try {
    const operatorId = req.params.operatorId;

    // Fetch feedbacks where the recipientId matches the operator's ID
    const feedbacks = await Feedback.find({ recipientId: operatorId })
      .populate("userId", "name email") // Populate the user who gave feedback
      .sort({ createdAt: -1 }); // Sort by latest feedback first

    if (!feedbacks.length) {
      return res.status(404).json({ message: "No feedback found for your stations." });
    }

    res.json(feedbacks);
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    res.status(500).json({ message: "Error fetching feedbacks" });
  }
});


// API to get station and slot details for a station operator
app.get("/api/operator/stats/:operatorId", async (req, res) => {
  try {
    const { operatorId } = req.params;

    // Find all stations managed by this operator
    const stations = await ChargingStation.find({ userId: operatorId });

    // Count total stations
    const totalStations = stations.length;

    // Count total slots from all stations
    let totalSlots = 0;

    // Get all station IDs
    const stationIds = stations.map(station => station._id);

    // Count available slots from Slot table
    const activeSlots = await Slot.countDocuments({
      stationId: { $in: stationIds },
      operationalStatus: "available"
    });

    // Count total slots from all stations
    totalSlots = await Slot.countDocuments({
      stationId: { $in: stationIds }
    });

    res.json({
      totalStations,
      totalSlots,
      activeSlots,
    });
  } catch (error) {
    console.error("Error fetching station stats:", error);
    res.status(500).json({ message: "Server error" });
  }
});




// Listen on the specified ports
const PORT = 5006;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
