const express = require("express");
const dotenv = require("dotenv");
const pool = require("./config/db");

dotenv.config();

const app = express();

// Parse JSON requests
app.use(express.json());

// Debug middleware (optional)
app.use((req, res, next) => {
    console.log("Content-Type:", req.headers["content-type"]);
    console.log("Body:", req.body);
    next();
});

// Database Connection
pool.connect()
    .then(() => {
        console.log("✅ PostgreSQL Connected Successfully");
    })
    .catch(err => {
        console.error("❌ Database Connection Failed:", err.message);
    });

// Import Middleware
const authMiddleware = require("./middleware/authMiddleware");

// Import Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/doctors", require("./routes/doctorRoutes"));
app.use("/api/appointments", require("./routes/appointmentRoutes"));
app.use("/api/patients", require("./routes/patientRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/doctor", require("./routes/doctorDashboardRoutes"));
// Home Route
app.get("/", (req, res) => {
    res.json({
        message: "Hospital Management API is Running 🚀"
    });
});

// Protected Dashboard Route
app.get("/api/dashboard", authMiddleware, (req, res) => {
    res.json({
        message: "Welcome to Patient Dashboard",
        loggedInUser: req.user
    });
});

// View Patients
app.get("/patients", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM patients");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Database Error"
        });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server Running on Port ${PORT}`);
});