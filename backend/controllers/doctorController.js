const pool = require("../config/db");

// =========================
// ADD DOCTOR
// =========================
exports.addDoctor = async (req, res) => {
    try {

        const {
            doctor_name,
            specialization,
            experience,
            consultation_fee,
            phone,
            email
        } = req.body;

        const result = await pool.query(
            `INSERT INTO doctors
            (doctor_name, specialization, experience, consultation_fee, phone, email)
            VALUES ($1,$2,$3,$4,$5,$6)
            RETURNING *`,
            [
                doctor_name,
                specialization,
                experience,
                consultation_fee,
                phone,
                email
            ]
        );

        res.status(201).json({
            message: "Doctor Added Successfully",
            doctor: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: error.message
        });
    }
};

// =========================
// GET ALL DOCTORS
// =========================
exports.getDoctors = async (req, res) => {
    try {

        const result = await pool.query(
            "SELECT * FROM doctors ORDER BY id ASC"
        );

        res.json(result.rows);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: error.message
        });
    }
};

// =========================
// UPDATE DOCTOR
// =========================
exports.updateDoctor = async (req, res) => {
    try {

        const { id } = req.params;

        const {
            doctor_name,
            specialization,
            experience,
            consultation_fee,
            phone,
            email
        } = req.body;

        const result = await pool.query(
            `UPDATE doctors
             SET doctor_name=$1,
                 specialization=$2,
                 experience=$3,
                 consultation_fee=$4,
                 phone=$5,
                 email=$6
             WHERE id=$7
             RETURNING *`,
            [
                doctor_name,
                specialization,
                experience,
                consultation_fee,
                phone,
                email,
                id
            ]
        );

        res.json({
            message: "Doctor Updated Successfully",
            doctor: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: error.message
        });
    }
};

// =========================
// DELETE DOCTOR
// =========================
exports.deleteDoctor = async (req, res) => {
    try {

        const { id } = req.params;

        await pool.query(
            "DELETE FROM doctors WHERE id=$1",
            [id]
        );

        res.json({
            message: "Doctor Deleted Successfully"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: error.message
        });
    }
};