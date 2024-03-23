'use strict'
//import modules
const express=require('express');
const router=express.Router();
const fs=require('fs').promises;
var passport = require("passport");
var User=require('../../models/users');
//

//
router.get('/',async(req,res)=>
{
    await res.status(200).render("home/index");
});
router.get('/about',async(req,res)=>
{
    await res.status(200).send('18120528-Nguyen Nhu Quang');
});
//Login
router.get('/login',async(req,res)=>
{
    const error=req.query.error;
    const ok=req.query.ok;
    await res.status(200).render('home/login',{error,ok});
});
router.post('/login',passport.authenticate('login',
{
    successRedirect: "/",
    failureRedirect: "/login?error=Wrong%20User%20Name%20or%20Password",
    failureFlash: true
}));
//Log Out
router.get('/logout',(req,res,next)=>
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
    const error=req.query.error;
    await res.status(200).render('home/signup',{error});
});
router.post('/signup', async (req, res,next) => {
    try {
        var body = req.body;
        const exist = await User.find({ $or: [{ username: body.username }, { email: body.email }] });
        console.log(exist.length);
        if (exist.length>0) 
        {
            console.log('User already exists!');
            res.redirect('/signup?error=Username%20already%20exists');
        } 
        else 
        {
            User.create(body);
            res.redirect('/login?ok=User%20Created');
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
