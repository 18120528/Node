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
    next();
});
router.use('/',require('./home'));
//export this module
module.exports=router;
