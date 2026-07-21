const pool = require("../config/db");

// ===============================
// BOOK APPOINTMENT
// ===============================
exports.bookAppointment = async (req, res) => {

    try {

        const patient_id = req.user.id;

        const {
            doctor_id,
            appointment_date,
            appointment_time,
            reason
        } = req.body;

        // Check doctor exists
        const doctor = await pool.query(
            "SELECT * FROM doctors WHERE id=$1",
            [doctor_id]
        );

        if (doctor.rows.length === 0) {
            return res.status(404).json({
                message: "Doctor not found"
            });
        }

        // Prevent double booking
        const existingAppointment = await pool.query(

            `SELECT * FROM appointments

             WHERE doctor_id=$1

             AND appointment_date=$2

             AND appointment_time=$3`,

            [
                doctor_id,
                appointment_date,
                appointment_time
            ]

        );

        if (existingAppointment.rows.length > 0) {

            return res.status(400).json({
                message: "Time slot already booked"
            });

        }

        // Book appointment
        const result = await pool.query(

            `INSERT INTO appointments

            (
                patient_id,
                doctor_id,
                appointment_date,
                appointment_time,
                reason
            )

            VALUES($1,$2,$3,$4,$5)

            RETURNING *`,

            [
                patient_id,
                doctor_id,
                appointment_date,
                appointment_time,
                reason
            ]

        );

        res.status(201).json({

            message: "Appointment Booked Successfully",

            appointment: result.rows[0]

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: error.message
        });

    }

};


// ===============================
// VIEW MY APPOINTMENTS
// ===============================

exports.myAppointments = async (req, res) => {

    try {

        const patient_id = req.user.id;

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

            ON appointments.doctor_id=doctors.id

            WHERE patient_id=$1

            ORDER BY appointment_date`,

            [patient_id]

        );

        res.json(result.rows);

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};


// ===============================
// CANCEL APPOINTMENT
// ===============================

exports.cancelAppointment = async (req, res) => {

    try {

        const patient_id = req.user.id;

        const { id } = req.params;

        const result = await pool.query(

            `DELETE FROM appointments

            WHERE id=$1

            AND patient_id=$2

            RETURNING *`,

            [
                id,
                patient_id
            ]

        );

        if (result.rows.length === 0) {

            return res.status(404).json({

                message: "Appointment not found"

            });

        }

        res.json({

            message: "Appointment Cancelled Successfully"

        });

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};


// ===============================
// ADMIN - VIEW ALL APPOINTMENTS
// ===============================

exports.allAppointments = async (req, res) => {

    try {

        const result = await pool.query(

            `SELECT

                appointments.id,

                patients.name,

                doctors.doctor_name,

                doctors.specialization,

                appointments.appointment_date,

                appointments.appointment_time,

                appointments.reason,

                appointments.status

            FROM appointments

            JOIN patients

            ON appointments.patient_id=patients.id

            JOIN doctors

            ON appointments.doctor_id=doctors.id

            ORDER BY appointment_date`

        );

        res.json(result.rows);

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};