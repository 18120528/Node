'use strict'
//import modules
const express=require('express');
const router=express.Router();
//
router.use((req,res,next)=>
{
    res.locals.currentUser=req.user;
    res.locals.error = req.flash("error");
    res.locals.info = req.flash("info");
    next();
});
router.use('/',require('./home'));
router.use('/post',require('./post'));
router.use('/profile',require('./profile'));
router.use('/dashboard',require('./dashboard'));
router.use('/chat',require('./chat'));
//export this module
module.exports=router;
