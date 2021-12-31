const express=require("express");
const router=express.Router();

//we will define /logout route here.
router.get("/", (req,res)=>{

    //then adjust our cookie and we will expire date.
    return res.status(200).cookie({
      httpOnly:true,
      expires:new Date(Date.now()),
      secure:false
    }).json({
        success: true,
        message:"Log out is successful"
    })


})

module.exports=router;