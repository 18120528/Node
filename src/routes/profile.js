'use strict';

// Import modules
const express = require('express');
const router = express.Router();
const fs=require('fs');
//custom middleware
const upload=require('../middlewares/upload/uploadImage');
const ifLoggin = require("../middlewares/auth/authen");
const ifAuthorized=require('../middlewares/auth/author');
const User = require('../models/users');
// Set up middleware
router.use(ifLoggin);
//Default routing 
router.get("/", (req, res) => {
    if(res.locals.error[0]==='The user does not exist!!!')
    {
        req.flash("error", 'The user does not exist!!!');
    }
    res.redirect(`/profile/${req.user.username}`);
});
//Get user profile
router.get('/:username',async (req,res)=>{
    let user= await User.findOne({username: req.params.username});
    if(user)
    {
        res.status(200).render("profile/profile-home",{user});
    }
    else
    {
        req.flash("error", 'The user does not exist!!!');
        res.redirect("/profile/");
    }
})
router.post('/:username', ifAuthorized, upload.single('image'), async (req,res)=>
{
    try 
    {
        let user=await User.findOne({username: req.params.username});
        let image=user.image;
        if(req.file)
        {
            image=req.file.path;
            fs.unlink(user.image, (err) => //local
            {
                if (err) {
                    console.error('Error removing image:', err);
                }
            });  
        }
        await User.updateOne({ username: req.params.username }, { $set: { bio: req.body.bio, image: image } });//if  1 element=undefined=>not update
        res.redirect("/profile/"+req.params.username);
    } catch (err) 
    {
        if (err) 
        {
            req.flash("error", err.message);
            res.redirect("/profile/");
        }
    }
});
//personal setting page
router.get('/:username/setting', ifAuthorized, async(req, res)=>
{
    let user= await User.findOne({username: req.params.username}).populate({path: 'personalID'});
    res.status(200).render("profile/profile-setting",{user});
});
//Make setting change
router.post('/:username/setting', ifAuthorized, async(req,res)=>
{
    let user=await User.findOne({username: req.params.username}).populate({path: 'personalID'});
    user.personalID.darkMode=req.body.darkMode;
    user.personalID.notify=req.body.notify;
    await user.personalID.save();
    res.redirect(`/profile/${req.params.username}/setting`);
});
//Get Activity
router.get('/:username/activity', ifAuthorized, async(req,res)=>
{
    try {
        let pageNum = parseInt(req.query.page) || 1;
        let pageSize = 20;
        let skip = (pageNum - 1) * pageSize;
        // Fetch the required subset of records
        let user = await User.findOne({username: req.params.username}).populate({path: 'personalID'});
        let logs = user.personalID.log.reverse();
        //
        let maxPages = Math.ceil(logs.length / pageSize);
        logs=logs.slice(skip, skip + pageSize);
        //
        res.status(200).render("profile/profile-activity", {
        logs,
        pageNum,
        max: maxPages
        });
    } catch (err) {
        if (err) {
            req.flash("error", err.message);
            res.redirect(`/profile/${req.params.username}`);
        }
    }
});

module.exports = router;