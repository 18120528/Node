'use strict'
//import modules
const express=require('express');
const fs=require('fs').promises;
const path = require('path');
const mongoose = require('mongoose');
const uri=require('./models/params/mongoProfile');
var bodyParser = require('body-parser');
//
var cookieParser = require("cookie-parser");
var passport = require("passport");
var setUpPassPort=require('./configs/passportStrategy');
var session = require("express-session");
var flash = require("connect-flash");
var cors = require("cors");
//connect DB
const app=express();
mongoose.connect(uri);
setUpPassPort();
//Middleware
app.use(cors());
app.use(cookieParser());//???
app.use(session({//for authen session
    secret:"doemlfgddfsoi!gjdsf5684561dsf",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());//???
app.use(passport.session());//Luu thong tin session khi authenticated=> must above route or will be skipped
app.use(flash());//???
//
app.use(express.json());
app.use(bodyParser.urlencoded({extended:false}));//body into body.u body.p
//Set render
app.set('views',path.join(__dirname,'views'));//views location
app.set('view engine','ejs');//render template
//
app.use('/',require('./routes/web/index'));//Route alway last
app.use('/api',require('./routes/api/index'));
//Start the Server
const PORT=9000;
app.listen(process.env.PORT||PORT,()=>
{
    console.log(`Server is running at Port: ${process.env.PORT||PORT}`);
});
