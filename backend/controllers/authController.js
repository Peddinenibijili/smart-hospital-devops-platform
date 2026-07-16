const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await pool.query(
      "SELECT * FROM patients WHERE email=$1",
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO patients(name,email,password) VALUES($1,$2,$3) RETURNING id,name,email",
      [name, email, hashedPassword]
    );

    res.status(201).json({
      message: "Registration Successful",
      patient: result.rows[0],
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

exports.login = async (req, res) => {

  try{

    const { email,password } = req.body;

    const result = await pool.query(
      "SELECT * FROM patients WHERE email=$1",
      [email]
    );

    if(result.rows.length==0){

      return res.status(400).json({
        message:"Invalid Email"
      });

    }

    const patient=result.rows[0];

    const validPassword=await bcrypt.compare(
      password,
      patient.password
    );

    if(!validPassword){

      return res.status(401).json({
        message:"Invalid Password"
      });

    }

    const token=jwt.sign(
      {
        id:patient.id,
        email:patient.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn:process.env.JWT_EXPIRES_IN
      }
    );

    res.json({
      message:"Login Successful",
      token
    });

  }catch(error){

    console.log(error);

    res.status(500).json({
      message:"Server Error"
    });

  }

}