require("dotenv").config(); // Load environment variables first

const express = require("express");
const connectDB = require("./config/db");
const certificateRoutes = require("./routes/certificateRoutes");

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use("/api/certificates", certificateRoutes);

// Handle undefined routes
app.use((req, res, next) => {
    res.status(404).json({ message: "Route not found" });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
