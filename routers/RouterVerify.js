const express=require("express");
const router=express.Router();
const {verifyJWT}=require("../helpers/HelperFunctions")

//we will define /verify/ route here.
router.get("/",verifyJWT,(req,res)=>{
    //this route is for jwt authentication verification.
    //all pages of front end sends get request to this route.
    //if the request has a valid jwt, the route send true
    res.status(200).json({
        success:true,
        message:"authentication is done."
    })
})

module.exports=router;