const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// 1. Doctor Login
exports.login=async(req,res)=>{

try{

const {email,password}=req.body;

const result=await pool.query(

"SELECT * FROM doctors WHERE email=$1",

[email]

);

if(result.rows.length===0){

return res.status(404).json({

message:"Doctor Not Found"

});

}

const doctor=result.rows[0];

/*console.log("Request Body:", req.body);
console.log("Doctor Record:", doctor);*/
console.log(password);
console.log(doctor.password);

const valid=await bcrypt.compare(

password,

doctor.password

);

if(!valid){

return res.status(401).json({

message:"Invalid Password"

});

}

const token=jwt.sign(

{

id:doctor.id,

email:doctor.email,

role:"doctor"

},

process.env.JWT_SECRET,

{

expiresIn:"1h"

}

);

res.json({

message:"Doctor Login Successful",

token

});

}

catch(err){

res.status(500).json({

message:err.message

});

}

};

// 2. Doctor Profile
exports.profile=async(req,res)=>{

try{

const id=req.user.id;

const result=await pool.query(

`SELECT

id,

doctor_name,

specialization,

experience,

consultation_fee,

phone,

email,

available

FROM doctors

WHERE id=$1`,

[id]

);

res.json(result.rows[0]);

}

catch(err){

res.status(500).json({

message:err.message

});

}

};

// 3. Doctor Appointments
exports.myAppointments=async(req,res)=>{

try{

const doctorId=req.user.id;

const result=await pool.query(

`SELECT

appointments.id,

patients.name,

appointment_date,

appointment_time,

reason,

status

FROM appointments

JOIN patients

ON appointments.patient_id=patients.id

WHERE doctor_id=$1

ORDER BY appointment_date`,

[doctorId]

);

res.json(result.rows);

}

catch(err){

res.status(500).json({

message:err.message

});

}

};
// 4. Update Availability
exports.updateAvailability=async(req,res)=>{

try{

const doctorId=req.user.id;

const {available}=req.body;

const result=await pool.query(

`UPDATE doctors

SET available=$1

WHERE id=$2

RETURNING *`,

[available,doctorId]

);

res.json({

message:"Availability Updated",

doctor:result.rows[0]

});

}

catch(err){

res.status(500).json({

message:err.message

});

}

};

// 5. Update Appointment Status
exports.updateAppointmentStatus=async(req,res)=>{

try{

const {id}=req.params;

const {status}=req.body;

const result=await pool.query(

`UPDATE appointments

SET status=$1

WHERE id=$2

RETURNING *`,

[status,id]

);

res.json({

message:"Appointment Updated",

appointment:result.rows[0]

});

}

catch(err){

res.status(500).json({

message:err.message

});

}

};