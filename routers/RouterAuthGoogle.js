const express=require("express");
const router=express.Router();
const axios=require("axios");
const queryString=require("query-string");
const jwt=require("jsonwebtoken");

const getToken=async ({
    code,
    clientId,
    clientSecret,
    redirectUri,
  })=>{
    const url = "https://oauth2.googleapis.com/token";
    const values = {
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
    };

    const data=await axios
    .post(url, queryString.stringify(values), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }).then((res) => res.data)
    .catch((error) => {
      console.error(`Failed to fetch auth tokens`);
      throw new Error(error.message);
    });

    return data;
}

//auth via google
router.get("/", async (req,res)=>{
    const code=req.query.code

    const {id_token,access_token}=await getToken({
        code,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret:process.env.GOOGLE_CLIENT_SECRET,
        redirectUri: "http://localhost:2400/auth/google"
    })

    const googleUser = await axios
    .get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
      {
        headers: {
          Authorization: `Bearer ${id_token}`,
        },
      }
    ).then((res) => res.data)
    .catch((error) => {
      console.error(`Failed to fetch user`);
      throw new Error(error.message);
    });

    const token = jwt.sign({data:googleUser},process.env.JWT_SECRET_KEY,{expiresIn:process.env.JWT_EXPIRE});
    res.status(200).cookie("access_token",token,
    {
      httpOnly:true,
      expires:new Date(Date.now()+(parseInt(process.env.COOKIE_EXPIRE)*1000)), //process.env.COOKIE_EXPIRE is milisecond
    }).json({
      success: true,
      message:"You are authenticated",
    });
});

module.exports=router;