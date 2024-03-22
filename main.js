'use strict'
//import modules
const express=require('express');
const fs=require('fs').promises;
const path = require('path');
const mongoose = require('mongoose');
const uri=require('./params/mongoProfile');
var bodyParser = require('body-parser');
//
var cookieParser = require("cookie-parser");
var passport = require("passport");
var setUpPassPort=require('./passportStrategy');
var session = require("express-session");
var flash = require("connect-flash");
//connect DB
const app=express();
mongoose.connect(uri);
setUpPassPort();
//Middleware
app.use(cookieParser());
app.use(session({
    secret:"doemlfgddfsoi!gjdsf5684561dsf",
    resave:false,
    saveUninitialized:false
}));
//
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
//
app.use(express.json());
app.use(bodyParser.urlencoded({extended:false}));
//

//
app.use('/',require('./routes/web/index'));
app.use('/api',require('./routes/api/index'));
//Set render
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

//Start the Server
const PORT=9000;
app.listen(process.env.PORT||PORT,()=>
{
    console.log(`Server is running at Port: ${process.env.PORT||PORT}`);
});


