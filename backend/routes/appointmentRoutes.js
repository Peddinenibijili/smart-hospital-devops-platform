const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const appointmentController = require("../controllers/appointmentController");


// Book Appointment
router.post(
    "/",
    authMiddleware,
    appointmentController.bookAppointment
);


// My Appointments
router.get(
    "/my",
    authMiddleware,
    appointmentController.myAppointments
);


// Cancel Appointment
router.delete(
    "/:id",
    authMiddleware,
    appointmentController.cancelAppointment
);


// View All Appointments
router.get(
    "/",
    authMiddleware,
    appointmentController.allAppointments
);


module.exports = router;