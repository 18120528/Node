'use strict'
//import modules
const express=require('express');
const router=express.Router();
//
const User = require("../../models/users");
//
const ifLoggin = require("../../middlewares/auth/authen");
//
router.use(ifLoggin);
//Homepage
router.get('/:username', async (req,res)=>
{
    let user=await User.findOne({username: req.params.username});
    res.status(200).render('chat/1-1chat',{user: user});
});

module.exports=router;