const express=require("express");
const router=express.Router();
const {changePassword}=require("../helpers/HelperFunctions")

//we will define /changepassword/ route here
router.post("/",changePassword)

module.exports=router;