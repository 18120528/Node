'use strict'
//import modules
const express=require('express');
const router=express.Router();
//
const User = require("../../models/users");
//
const ifLoggin = require("../../middlewares/auth/authen");
//
const selfChatCheck=function (req, res, next)
{
    if(req.params.username===req.user.username)
    {
        req.flash("error", "Can't chat with yourself!!!");
        res.redirect("/");
    }
    else
    {
        next();
    }
};
//
router.use(ifLoggin);
//Homepage
router.get('/:username', selfChatCheck, async (req,res)=>
{
    let user=await User.findOne({username: req.params.username});
    res.status(200).render('chat/1-1chat',{user: user});
});

module.exports=router;