'use strict'
//import modules
const express=require('express');
const router=express.Router();
var passport = require("passport");
const crypto = require('crypto');
//
const post = require("../../models/formPost");
const User=require('../../models/users');
const Session=require('../../models/activeSession');
//Controller
const sendEmail=require('../../controllers/sendEmail');
//Homepage
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
//Get changepwd page
router.get('/changepwd', (req, res)=>
{
    res.status(200).render('home/changepwd');
});
//Change Password
router.post('/changepwd', async(req, res)=>
{
    let user=await User.findOne({username: req.body.username});
    if(user)
    {
      await user.checkPass(req.body.old_password, async (err,isMatch)=>
      {
        if(err)
        {
            req.flash("error", err);
            res.redirect('/changepwd');
        }
        if(isMatch) 
        {
            await User.updateOne({username: req.body.username}, {password: req.body.new_password});
            req.flash("info", "Success");
            res.redirect('/login');
        }
        else 
        {
            req.flash("error", "The old password does not match!");
            res.redirect('/changepwd');
        }
      });
    }
    else
    {
        req.flash("error", "The Username Do Not Existed!");
        res.redirect('/changepwd');
    }
});
//Get forgetpwd page
router.get('/forgetpwd', (req, res)=>
{
    res.status(200).render('home/forgetpwd');
});
//Get new password
router.post('/forgetpwd', async (req, res)=>
{
    let user=await User.findOne({email: req.body.email});
    if(user)
    {
        let newpassword=crypto.pseudoRandomBytes(5).toString('hex');console.log(newpassword);
        //await User.updateOne({username: user.username}, {password: newpassword});
        let subject="Quang-Reset Password";
        let content={
            password: `${newpassword}`
        };
        sendEmail(user.email, subject, content);
        req.flash("info", "Check your email");
        res.redirect('/login');
    }
    else
    {
        req.flash("error", "The Account does not exist!!!");
        res.redirect('/forgetpwd');
    }
});

//export this module
module.exports=router;
