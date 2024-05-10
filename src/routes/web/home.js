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
const confirmCode=require('../../models/confirmCode');
//Controller
const {sendEmail, mailOptions}=require('../../controllers/sendEmail');
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
    if(req.user)
    {
        res.redirect('/');
    }
    else
    {
        res.status(200).render('home/login');
    }
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
    if(req.user)
    {
        await Session.findOneAndDelete({ userID: req.user.id, sessionID: req.sessionID });
        req.logOut((err)=>
        {
            if(err){return next(err);}
            req.session.destroy();
            res.redirect('/');
        });
    }
    else
    {
        res.redirect('/');
    }
});
//Sign Up
router.get('/signup', async (req,res)=>
{
    if(req.user)
    {
        res.redirect('/');
    }
    else
    {
        res.status(200).render('home/signup');
    }
});
router.post('/signup', async (req, res) => {
    try {
        let exist = await User.findOne({ $or: [{ username: req.body.username }, { email: req.body.email }] });
        if (exist) 
        {
            req.flash("error", "User or Email Already Existed!!!");
            res.redirect('/signup');
        } 
        else 
        {
            let user=await User.create(req.body);
            let code=crypto.pseudoRandomBytes(64).toString('hex');
            await confirmCode.create({code: code, userID: user._id});
            let option=mailOptions.emailConfirm;
            let content={
                email: req.body.email,
                subject: 'Quang-Account acctivate',
                username: req.body.username,
                code: code
            }
            sendEmail(content, option);
            req.flash("info", "Sign Up Success, check your linked email to activate the account!");
            res.redirect('/login');
        }
    } catch (err) 
    {
        console.error(err);
        // Handle timeout error
        res.status(500).send('Timeout error occurred. Please try again later.');
    }
});
//Active Account
router.get('/accountactive/:code', async(req, res)=>
{
    let account=await confirmCode.findOne({code: req.params.code}).populate({path: 'userID'});
    if(account)
    {
        account.userID.active=true;
        await account.userID.save();
        await confirmCode.findOneAndDelete({code: req.params.code});
        res.status(200).send('Your Account has been Activated!');
    }
    else
    {
        res.status(404).send('The Activation Code is Expired or Wrong!!!');
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
    if(req.user)
    {
        res.redirect('/');
    }
    else
    {
        res.status(200).render('home/forgetpwd');
    }
});
//Get new password
router.post('/forgetpwd', async (req, res)=>
{
    let user=await User.findOne({email: req.body.email});
    if(user)
    {
        let newpassword=crypto.pseudoRandomBytes(5).toString('hex');
        await User.updateOne({username: user.username}, {password: newpassword});
        let content={
            username: user.username,
            password: `${newpassword}`,
            email: user.email,
            subject: "Quang-Reset Password"
        };
        let option=mailOptions.resetPwd;
        sendEmail(content, option);
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
