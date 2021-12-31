const mongoose = require("mongoose");
const asyncErrorWrapper=require("express-async-handler");

// for the explanation of asyncErrorWrapper keyword pls see app.js.

//in this module we will establish configuration of mongoDB connection.
//we will create function that will implement the connection.
const connectDatabase= asyncErrorWrapper(async ()=>{
    //this function will be asynchronous

    //in order to connect mongoDB we will use mongoose.connect function.
    //we will mongoDB URI from dot.env in this function.
    //Also we need pass a json object for configuration in order to remove warnings. 
    //{useNewUrlParser: true,useUnifiedTopology: true,useCreateIndex: true,useFindAndModify: false} is for removing the warnings.
    const conn= await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    })
    
    console.log("connected to database")
});

module.exports=connectDatabase;
