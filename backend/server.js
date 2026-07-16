const express = require("express");
const dotenv = require("dotenv");
const pool = require("./config/db");

dotenv.config();

const app = express();

app.use(express.json());

pool.connect()
.then(()=>{
    console.log("PostgreSQL Connected");
})
.catch(err=>{
    console.log(err.message);
});

app.use("/api/auth", require("./routes/authRoutes"));

const authMiddleware=require("./middleware/authMiddleware");

app.get("/api/dashboard", authMiddleware, (req,res)=>{

    res.json({
        message:"Welcome Patient Dashboard",
        user:req.user
    });

});

const PORT=process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`Server Running on ${PORT}`);
});