'use strict'
//import modules
const express=require('express');
const router=express.Router();
const fs=require('fs').promises;
//
//TODO: add in and error
//router.use('/login',require('./login'));
router.use('/',require('./home'));

//export this module
module.exports=router;
