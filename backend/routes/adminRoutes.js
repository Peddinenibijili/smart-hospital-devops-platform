const express=require("express");

const router=express.Router();

const authMiddleware=require("../middleware/authMiddleware");

const adminMiddleware=require("../middleware/adminMiddleware");

const adminController=require("../controllers/adminController");


// LOGIN
router.post(

"/login",

adminController.adminLogin

);


// DASHBOARD

router.get(

"/dashboard",

authMiddleware,

adminMiddleware,

adminController.dashboard

);

module.exports=router;