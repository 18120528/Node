'use strict'
//import modules
const express=require('express');
const router=express.Router();
const fs=require('fs').promises;
var passport = require("passport");
const post = require("../../models/formPost");
//
var User=require('../../models/users');
//
router.get('/',async(req,res)=>
{
    let postList=await post.find().sort({ createDate: -1 });
    res.status(200).render("home/index",{postList});
});
router.get('/about',async(req,res)=>
{
    res.status(200).send('18120528-Nguyen Nhu Quang');
});
//Login
router.get('/login',async(req,res)=>
{
    res.status(200).render('home/login');
});
router.post('/login',passport.authenticate('login',
{
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
}));
//Log Out
router.get('/logout',async (req,res,next)=>
{
    req.logOut((err)=>
    {
        if(err){return next(err);}
        res.redirect('/');
    });

})
//Sign Up
router.get('/signup', async (req,res)=>
{
    res.status(200).render('home/signup');
});
router.post('/signup', async (req, res) => {
    try {
        var body = req.body;
        const exist = await User.find({ $or: [{ username: body.username }, { email: body.email }] });
        console.log(exist.length);
        if (exist.length>0) 
        {
            req.flash("error", "User or Email Already Existed!!!");
            res.redirect('/signup');
        } 
        else 
        {
            User.create(body);
            req.flash("info", "Sign Up Success!!!");
            res.redirect('/login');
        }
    } catch (err) 
    {
        console.error(err);
        // Handle timeout error
        res.status(500).send('Timeout error occurred. Please try again later.');
    }
});
//export this module
module.exports=router;
