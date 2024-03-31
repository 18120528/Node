'use strict'
//import modules
const express=require('express');
const router=express.Router();
const fs=require('fs').promises;
//
//TODO: add in and error
router.use((req,res,next)=>
{
    res.locals.currentUser=req.user;
    res.locals.error = req.flash("error");
    res.locals.info = req.flash("info");
    next();
});
router.use('/',require('./home'));
router.use('/post',require('./post'));
//export this module
module.exports=router;
