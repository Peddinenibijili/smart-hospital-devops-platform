const express=require("express");

const router=express.Router();


router.post("/",(req,res)=>{


const appointment=req.body;


res.json({

message:
"Appointment booked successfully",

details:appointment


});


});


router.get("/",(req,res)=>{


res.json([

{
patient:"John",
doctor:"Dr Rao",
date:"2026-07-15"
}

]);


});


module.exports=router;