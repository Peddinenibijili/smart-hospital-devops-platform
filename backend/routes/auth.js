const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const router = express.Router();

/*
==========================================
REGISTER
==========================================
*/
router.post("/register", async (req, res) => {
    try {

        console.log("Request Body:", req.body);

        const { name, email, password } = req.body;

        const existingUser = await pool.query(
            "SELECT * FROM patients WHERE email = $1",
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({
                message: "Email already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            `INSERT INTO patients(name,email,password)
             VALUES($1,$2,$3)
             RETURNING id,name,email`,
            [name, email, hashedPassword]
        );

        res.status(201).json({
            message: "Patient registered successfully",
            patient: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Registration failed"
        });
    }
});

/*
==========================================
LOGIN
==========================================
*/
router.post("/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        const result = await pool.query(
            "SELECT * FROM patients WHERE email=$1",
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const patient = result.rows[0];

        const validPassword = await bcrypt.compare(
            password,
            patient.password
        );

        if (!validPassword) {
            return res.status(401).json({
                message: "Invalid password"
            });
        }

        const token = jwt.sign(
            {
                id: patient.id,
                email: patient.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        res.json({
            message: "Login successful",
            token
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Login failed"
        });
    }

});

module.exports = router;