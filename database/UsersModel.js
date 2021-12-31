const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const bcrypt=require("bcryptjs");

//we need to establish our data model and define the data for mongoDB.
//we will cerate a mongoDB schema.
//Note that for email we will use /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/ regex in order to provide example@example.com format.
//and "unique" keyword means that for example there will not be a password or register number the same with another in database.
const usersModel=new Schema({
    
    email:{
        type: String,
        required: [true,"Please provide an email"],
        unique:[true,"Please provide different email"],
        match:[
            /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
            "Please provide a valid email"
        ]
    },

    password:{
        type: String,
        minlength:8,
        required: [true,"Please provide a password"],
        unique:[true,"Please provide different password"],
        select:false // this parameter prevents to access password part in user data
    },

    city:{
        type: String,
    },

    name:{
        type: String,
    },

    surname:{
        type: String,
    },
    

    createdAt:{
        type: Date,
        default: Date.now()
    },

    updatedAt:{
        type: Date,
        default: Date.now()
    }


})

//we will use a mongoDB hook.
//just before save the data to database we will run a function.
//here "pre" keyword means that this function will run just before the save.
//if we use "post" keyword, that means the function will run just after the save.
//in this hook we will hash the user password.
//this hook will behave like a middleware so we will pass "next" parameter to the hook.
//for hashing we will use bcrypt package.
usersModel.pre("save",function (next){

    //assign current user to a variable
    var user=this;

    //isModified checks if the user is new or is there any change in any data of a user record.
    //this.isModified(this.password) checks only if the password of any user is changed.
    //our hash mechanism will run only when a password is changed.
    if(user.isModified(user.password)){

    //saltRounds is about hash number in a second.
    //saltRounds 9--> 20 hashes/second.
    //saltRounds 10--> 10 hashes/second.
    //saltRounds 11--> 5 hashes/second. etc.
    //lower saltRounds is more secure.
    const saltRounds=10;

    //we will generate salt at first
    //salt is a random string that makes the hash secure.
    bcrypt.genSalt(saltRounds, (err, salt)=> {
        
        if(err){
            //we will send the error to errorController function which we use as a middleware.
            next(err)
        }
        else{

            //and now hashing the password.
            bcrypt.hash(user.password, salt, (err, hash)=> {
                
                if(err){
                    //we will send the error to errorController function which we use as a middleware.
                    next(err)
                }
                else{
                    //now assign hash to password.
                    user.password=hash;
                    next();
                }
            });

        }
       
    });

    }

    
    //saltRounds is about hash number in a second.
    //saltRounds 9--> 20 hashes/second.
    //saltRounds 10--> 10 hashes/second.
    //saltRounds 11--> 5 hashes/second. etc.
    //lower saltRounds is more secure.
    const saltRounds=10;

    //we will generate salt at first
    //salt is a random string that makes the hash secure.
    bcrypt.genSalt(saltRounds, (err, salt)=> {
        
        if(err){
            //we will send the error to errorController function which we use as a middleware.
            next(err)
        }
        else{

            //and now hashing the password.
            bcrypt.hash(user.password, salt, (err, hash)=> {
                
                if(err){
                    //we will send the error to errorController function which we use as a middleware.
                    next(err)
                }
                else{
                    //now assign hash to password.
                    user.password=hash;
                    console.log("hashed")
                    next();
                }
            });

        }
       
    });
    
    
})

//now we will create a model with mongoose.model function.
//we will give "usersModel" as the name of model and pass our schema above in this function.
module.exports=mongoose.model("usersModel",usersModel)