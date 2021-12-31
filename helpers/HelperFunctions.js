const usersModel = require("../database/UsersModel");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const CustomError=require("../errors/CustomError");
const asyncErrorWrapper=require("express-async-handler");
const queryString=require("query-string");

// asyncErrorWrapper is a npm package
// and it automatically sends errors of user defined asynchronous functions to errorController function which we use as a middleware.
//thanks to this package we do not need to write our codes in try-catch block for our user defined asynchronous functions.


//get all users from database
const getUsersFromDB = asyncErrorWrapper(async (req, res) => {
    
    const data = await usersModel.find()
    res.send(data);
});

//create user to database
const createUserToDB = asyncErrorWrapper(async (req, res) => {

  const { email, password, city, name, surname, validationKey } = req.body;
  //in order to compare validation key sent by client and system validation key, we need an assignment.
  //validation key is in dot.env so we neeed to assign it to a variable.
  const SystemValidationKey = process.env.SYSTEM_VALIDATION_KEY;

  //then writing the conditions.
  if (validationKey === SystemValidationKey) {
    //create user data
    const userData = await usersModel.create({
      email,
      password,
      city,
      name,
      surname
    });
    //then send response to the client.
    res.status(200).json({
      success: true,
      user: userData
    });
  }
  else{
    res.status(200).json({
      success: false,
    });
  }
});


//generating json web token for user authentication 
const generateJWT=(userData)=>{
  
  return jwt.sign({data:userData},process.env.JWT_SECRET_KEY,{expiresIn:process.env.JWT_EXPIRE})
};


//verifiying token.
//this function will check the validation of token coming from the client in request header.
const verifyJWT=(req,res,next)=>{

  //at first we will assign token coming from in authorization key of request header to a variable.
  //make sure that the token is in string data type.
  //const token=JSON.parse('"'+req.headers.authorization+'"')
  const authHeader = req.headers["authorization"];
  const token = authHeader.split(" ")[1];

  //check the existence of the token.
  if (!token){
    res.json({
        success: false,
        message: "please login"
      })
  }
  else{
   
    jwt.verify(token,process.env.JWT_SECRET_KEY, (err, value) => {
      if (err) {
        //if err occurs:
        //we will create a custom error and pass message of error and 400 status to this as parameters.
        //we wrap custom error with next and send this to errorController function which we use as a middleware.
        return next(new CustomError("please login",400))
    }
      else{
        next()
      }
  })
  }
};

//handling log in issue
const logInControl= asyncErrorWrapper(async (req,res,next) => {
 
  const {email,password}=req.body;

  //then check if the user exists in database via email and password of the user.
  //select:false is used for password part of the user model
  //so select("+password") is neccessary to implement password search additional to email.
  const dbControl= await usersModel.findOne({email:email}).select("+password");
  
  //write conditions according to existance of user data in mongoDB.
  if(!dbControl){

       return next(new CustomError("please sign up",400))
  }
 
  //check if the hashed password is the same with the other one coming from client request
  const isPasswordMatched=bcrypt.compareSync(password,dbControl.password);
  if(!isPasswordMatched){
    
    return next(new CustomError("password is not valid",400))
  }
  else{
    //if passwords match generate token.
    const token=generateJWT(email)
    //and send token win a cookie to the client.
    res.status(200).cookie("access_token",token,
    {
      httpOnly:true,
      expires:new Date(Date.now()+(parseInt(process.env.COOKIE_EXPIRE)*1000)), //process.env.COOKIE_EXPIRE is milisecond
    }).json({
      success: true,
      message:"You are authenticated",
    });

  }
});


//when a user wants to change his/her own password, this function runs.
const changePassword= asyncErrorWrapper(async (req,res)=>{

  //at first we will get SYSTEM_VALIDATION_KEY from dot.env
  const {SYSTEM_VALIDATION_KEY}=process.env;
  //then get neccessary data from body of client request.
  const {email,validationKey,newPassword}=req.body;
  

  if(validationKey===SYSTEM_VALIDATION_KEY){

    //if validation keys match we will hash new password and update the user data in database.

    //saltRounds is about hash number in a second.
    //saltRounds 9--> 20 hashes/second.
    //saltRounds 10--> 10 hashes/second.
    //saltRounds 11--> 5 hashes/second. etc.
    //lower saltRounds is more secure.
    const saltRounds=10;

    
    //salt is a random string that makes the hash secure.
    const salt=await bcrypt.genSalt(saltRounds);
    //then hassh new password and assign it to a variable.
    hashed_password=await bcrypt.hash(newPassword, salt);

    //new:true returns user data after update, while new:false before update.
    const options={new:true};
    const updatedDBData=await usersModel.findOneAndUpdate({email:email},{password:hashed_password},options);
    console.log(updatedDBData);
    //then return response to client.
    res.status(200).json({
      success:true,
      message:"your password has been changed"
    })
  }
  else{
    //if validation keys do not match return a response to client.
    res.status(200).json({
      success:false,
      message: "please check your email and validation key"
    })
  }

});

const getGoogleAuthURL=()=>{
  const rootURL="https://accounts.google.com/o/oauth2/v2/auth";
  const options={
    redirect_uri:"http://localhost:2400/auth/google",
    client_id:process.env.GOOGLE_CLIENT_ID,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: "email"
  }


  //"openid email profile" 
  //"https://www.google.apis.com/auth/userinfo.profile"
  //"https://www.google.apis.com/auth/userinfo.email"
  /*[
      "https://www.google.apis.com/auth/userinfo.profile",
      "https://www.google.apis.com/auth/userinfo.email"
    ].join(" "),*/
  const query=queryString.stringify(options);
  //"${rootURL}?${queryString.stringify(options)}"
  return rootURL+"?"+query;

}


module.exports = {
  getUsersFromDB,
  createUserToDB,
  logInControl,
  generateJWT,
  verifyJWT,
  changePassword,
  getGoogleAuthURL
};
