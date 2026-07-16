const express=require("express");

const router=express.Router();



router.get("/",(req,res)=>{


const doctors=[

{
id:1,
name:"Dr Rao",
specialization:"Cardiologist"
},

{
id:2,
name:"Dr Kumar",
specialization:"Neurologist"
}

];


res.json(doctors);


});


module.exports=router;