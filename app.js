const express=require("express");
const dotenv=require("dotenv");
const login=require("./routers/RouterLogin");
const users=require("./routers/RouterUsers");
const signup=require("./routers/RouterSignUp");
const logout=require("./routers/RouterLogOut");
const changepassword=require("./routers/RouterChangePassword");
const verify=require("./routers/RouterVerify")
const authURL=require("./routers/RouterGoogle")
const auth=require("./routers/RouterAuthGoogle")
const connectDatabase=require("./database/ConnectDatabase");
const errorcontroller=require("./errors/ErrorController");
const cors = require('cors');


//Environment variables
dotenv.config(
    {
        path: "./config/config.env"
    }
)

//connecting mongo database
connectDatabase();


const app=express();

const PORT=2400;

//CORS is Cross Origin Resource Sharing
//cors is for directing permission client request to third party site.
//if we want to apply cors middleware for whole application, we should use app.use(cors())
app.use(cors())


//json middleware
//thanks to method below, express recognizes the incoming Request Object as a JSON Object. 
//because of we will not specify any route, this middleware will run for whole application(all routes).
app.use(express.json());


//router middleware
app.use("/login",login);
app.use("/users",users);
app.use("/signup",signup);
app.use("/logout",logout);
app.use("/changepassword",changepassword);
app.use("/verify",verify);
app.use("/google",authURL);
app.use("/auth/google",auth);


//error controller middleware
app.use(errorcontroller)


app.listen(PORT,()=>{
    console.log("server is running on port: "+PORT)
})