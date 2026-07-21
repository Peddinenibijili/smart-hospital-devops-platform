const express=require("express");

const router=express.Router();

const auth=require("../middleware/authMiddleware");

const doctor=require("../controllers/doctorDashboardController");

const authMiddleware = require("../middleware/authMiddleware");

const doctorMiddleware = require("../middleware/doctorMiddleware");

const doctorController = require("../controllers/doctorController");
// Login
router.post("/login",doctor.login);

// Profile
router.get("/profile",auth,doctor.profile);

// My Appointments
//router.get("/appointments",auth,doctor.myAppointments);
router.get("/appointments", authMiddleware, doctorMiddleware, doctorController.myAppointments);

// Update Availability
router.put("/availability",auth,doctor.updateAvailability);

// Update Appointment Status
router.put("/appointments/:id",auth,doctor.updateAppointmentStatus);

module.exports=router;