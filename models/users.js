'use strict'
var bcrypt = require("bcryptjs");
var mongoose = require("mongoose");

//
const SALT_FACTOR = 10;

var userSchema = new mongoose.Schema(
{
    username:{type:String, required:true, unique:true},
    email:{type:String, required:true, unique:true},
    password:{type:String, required:true},
    createdAt:{type:Date, default:Date.now}
});
//pre-post-method()-methods.    
userSchema.pre("save", async function(next) 
{
    try 
    {
        if (!this.isModified("password"))
        {
            return next();
        }
        const salt = await bcrypt.genSalt(SALT_FACTOR);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
        return next();
    } catch (error) 
    {
        return next(error);
    }
});

userSchema.methods.checkPass=function(dbPass,done)
{
    if(!this.password) {return done(err);}
    bcrypt.compare(dbPass, this.password, (err,isMatch)=>
    {
        done(err,isMatch);
    });
}
//
var User=mongoose.model("users",userSchema);
module.exports=User;

