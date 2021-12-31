const express=require("express");
const router=express.Router();
const {createUserToDB} =require("../helpers/HelperFunctions")

//we will define /signup/ route here.
router.post("/",createUserToDB)

module.exports=router;