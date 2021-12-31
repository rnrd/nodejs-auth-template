const express=require("express");
const router=express.Router();
const {logInControl}=require("../helpers/HelperFunctions")

//we will define /login/ route here
router.post("/",logInControl)

module.exports=router;