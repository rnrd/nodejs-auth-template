const express=require("express");
const router=express.Router();
const {getUsersFromDB, verifyJWT}=require("../helpers/HelperFunctions");

//we will define / route and we will apply verifyJWT as the middleware of this route
router.get("/",verifyJWT,getUsersFromDB);

module.exports=router;