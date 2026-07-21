const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ===============================
// ADMIN LOGIN
// ===============================
// ====================================
// ADMIN DASHBOARD
// ====================================

exports.dashboard = async (req, res) => {

    try {

        const patients = await pool.query(

            "SELECT COUNT(*) FROM patients"

        );

        const doctors = await pool.query(

            "SELECT COUNT(*) FROM doctors"

        );

        const appointments = await pool.query(

            "SELECT COUNT(*) FROM appointments"

        );

        const todayAppointments = await pool.query(

            `SELECT COUNT(*)

             FROM appointments

             WHERE appointment_date=CURRENT_DATE`

        );

        res.json({

            totalPatients: Number(patients.rows[0].count),

            totalDoctors: Number(doctors.rows[0].count),

            totalAppointments: Number(appointments.rows[0].count),

            todayAppointments: Number(todayAppointments.rows[0].count)

        });

    }

    catch(error){

        console.log(error);

        res.status(500).json({

            message:error.message

        });

    }

};



exports.adminLogin = async (req, res) => {

    try {

        const { email, password } = req.body;

        // Check admin exists
        const result = await pool.query(
            "SELECT * FROM admins WHERE email = $1",
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Admin not found"
            });
        }

        const admin = result.rows[0];

        // Compare password
        const validPassword = await bcrypt.compare(
            password,
            admin.password
        );

        if (!validPassword) {
            return res.status(401).json({
                message: "Invalid Password"
            });
        }

        // Generate JWT
        const token = jwt.sign(
            {
                id: admin.id,
                email: admin.email,
                role: "admin"
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        res.json({
            message: "Admin Login Successful",
            token
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: error.message
        });

    }

};