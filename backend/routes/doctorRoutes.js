const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const doctorController = require("../controllers/doctorController");

// Add Doctor
router.post("/", authMiddleware, doctorController.addDoctor);

// Get All Doctors
router.get("/", authMiddleware, doctorController.getDoctors);

// Update Doctor
router.put("/:id", authMiddleware, doctorController.updateDoctor);

// Delete Doctor
router.delete("/:id", authMiddleware, doctorController.deleteDoctor);

module.exports = router;