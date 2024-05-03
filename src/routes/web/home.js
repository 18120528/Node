'use strict'
//import modules
const express=require('express');
const router=express.Router();
const fs=require('fs').promises;
var passport = require("passport");
//
const post = require("../../models/formPost");
const User=require('../../models/users');
const Session=require('../../models/activeSession');
//
router.get('/', async(req,res)=>
{
    if(req.session.passport)
    {
        let activeSessions=await Session.findOne({ userID: req.user.id });
        if(activeSessions)
        {
            if(activeSessions.sessionID!=req.sessionID)
            {
                req.session.destroy();
                res.locals.currentUser=null;
                return res.status(200).render('home/existed');
            }
        }
        else
        {
            Session.create({userID: req.user.id, sessionID: req.sessionID});
        }
    }
    let postList=await post.find().sort({ createDate: -1 });
    res.status(200).render("home/index",{postList});
});
router.get('/about',async(req,res)=>
{
    res.status(200).render('home/about');
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
    await Session.findOneAndDelete({ userID: req.user.id, sessionID: req.sessionID });
    req.logOut((err)=>
    {
        if(err){return next(err);}
        req.session.destroy();
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
