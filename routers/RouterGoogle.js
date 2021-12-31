const express=require("express");
const router=express.Router();
const {getGoogleAuthURL}=require("../helpers/HelperFunctions")

//get google auth url
router.get("/",(req,res)=>{
    res.send(getGoogleAuthURL())
});

module.exports=router;