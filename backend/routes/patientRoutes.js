const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const patientController = require("../controllers/patientController");

// =========================
// PROFILE
// =========================

router.get(
    "/profile",
    authMiddleware,
    patientController.getProfile
);

// =========================
// UPDATE PROFILE
// =========================

router.put(
    "/profile",
    authMiddleware,
    patientController.updateProfile
);

// =========================
// CHANGE PASSWORD
// =========================

router.put(
    "/change-password",
    authMiddleware,
    patientController.changePassword
);

// =========================
// APPOINTMENT HISTORY
// =========================

router.get(
    "/history",
    authMiddleware,
    patientController.appointmentHistory
);

module.exports = router;