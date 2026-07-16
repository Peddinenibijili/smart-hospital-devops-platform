const pool = require("../config/database");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
exports.login = async(req,res)=>{

try{

const {
email,
password
}=req.body;


// Find patient

const result = await pool.query(
"SELECT * FROM patients WHERE email=$1",
[email]
);


if(result.rows.length === 0){

return res.status(404).json({

message:"User not found"

});

}


const patient = result.rows[0];


// Compare password

const passwordMatch =
await bcrypt.compare(
password,
patient.password
);


if(!passwordMatch){

return res.status(401).json({

message:"Invalid password"

});

}


// Generate JWT token

const token = jwt.sign(

{
id: patient.id,
email: patient.email
},

process.env.JWT_SECRET,

{
expiresIn:"1h"
}

);



res.json({

message:"Login successful",

token:token

});


}

catch(error){

console.log(error);


res.status(500).json({

message:"Login failed"

});

}


};