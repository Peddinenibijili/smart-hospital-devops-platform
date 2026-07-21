const pool = require("../config/db");
const bcrypt = require("bcrypt");

// ======================================
// GET PATIENT PROFILE
// ======================================
exports.getProfile = async (req, res) => {
    try {

        const patientId = req.user.id;

        const result = await pool.query(
            `SELECT id, name, email
             FROM patients
             WHERE id = $1`,
            [patientId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Patient not found"
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: error.message
        });
    }
};

// ======================================
// UPDATE PROFILE
// ======================================
exports.updateProfile = async (req, res) => {

    try {

        const patientId = req.user.id;

        const { name, email } = req.body;

        const result = await pool.query(

            `UPDATE patients
             SET name=$1,
                 email=$2
             WHERE id=$3
             RETURNING id,name,email`,

            [name, email, patientId]

        );

        res.json({
            message: "Profile Updated Successfully",
            patient: result.rows[0]
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: error.message
        });

    }

};

// ======================================
// CHANGE PASSWORD
// ======================================
exports.changePassword = async (req, res) => {

    try {

        const patientId = req.user.id;

        const {
            oldPassword,
            newPassword
        } = req.body;

        const patient = await pool.query(

            "SELECT * FROM patients WHERE id=$1",

            [patientId]

        );

        if (patient.rows.length === 0) {

            return res.status(404).json({
                message: "Patient not found"
            });

        }

        const validPassword = await bcrypt.compare(

            oldPassword,

            patient.rows[0].password

        );

        if (!validPassword) {

            return res.status(401).json({

                message: "Old Password is Incorrect"

            });

        }

        const hashedPassword = await bcrypt.hash(

            newPassword,

            10

        );

        await pool.query(

            `UPDATE patients
             SET password=$1
             WHERE id=$2`,

            [
                hashedPassword,
                patientId
            ]

        );

        res.json({

            message: "Password Changed Successfully"

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            message: error.message

        });

    }

};

// ======================================
// APPOINTMENT HISTORY
// ======================================
exports.appointmentHistory = async (req, res) => {

    try {

        const patientId = req.user.id;

        const result = await pool.query(

            `SELECT

                appointments.id,

                doctors.doctor_name,

                doctors.specialization,

                appointments.appointment_date,

                appointments.appointment_time,

                appointments.reason,

                appointments.status

            FROM appointments

            JOIN doctors

            ON appointments.doctor_id = doctors.id

            WHERE appointments.patient_id = $1

            ORDER BY appointments.appointment_date DESC`,

            [patientId]

        );

        res.json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({

            message: error.message

        });

    }

};