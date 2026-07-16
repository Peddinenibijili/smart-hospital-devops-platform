const jwt = require("jsonwebtoken");


const authenticateToken = (req,res,next)=>{


const authHeader = req.headers["authorization"];


console.log("AUTH HEADER:", authHeader);


const token = authHeader && authHeader.split(" ")[1];


if(!token){

return res.status(401).json({

message:"Access denied. Token missing"

});

}


jwt.verify(

token,

process.env.JWT_SECRET,

(error,user)=>{


if(error){

return res.status(403).json({

message:"Invalid token"

});

}


req.user=user;

next();


});


};


module.exports=authenticateToken;