'use strict';

// Import modules
const express = require('express');
const router = express.Router();
const fs=require('fs');
//custom middleware
const User = require("../models/users");
const Posts = require("../models/formPost");
const Session = require("../models/activeSession");
const upload=require('../middlewares/upload/uploadImage');
const ifLoggin = require("../middlewares/auth/authen");
const ifAdmin = require("../middlewares/auth/admin");
const ifAuthorized=require('../middlewares/auth/author');
// Set up middleware
router.use(ifLoggin);
//Get Dashboard 
router.get("/", ifAdmin, async (req, res) => {
    let pageNum = parseInt(req.query.page) || 1;
    let pageSize = 10;
    let skip = (pageNum - 1) * pageSize;
    //
    let posts=await Posts.find();
    let sessions=await Session.find();
    //
    let users=await User.find().skip(skip).limit(pageSize);
    //
    let totalUsers = await User.countDocuments();
    let maxPages = Math.ceil(totalUsers / pageSize);
    //
    res.status(200).render('dashboard/dashboard-home',{users, pageNum, max: maxPages, posts, sessions});
});
//Update Roles
router.post("/role", ifAdmin, async(req,res)=> {
    let usernames=req.body.username;
    let actives=req.body.active;
    let roles=req.body.role;
    if (!Array.isArray(usernames)) 
    {
        usernames = [usernames];
        actives = [actives];
        roles = [roles];
    }
    for (let index = 0; index < usernames.length; index++) 
    {
        await User.updateOne({ username: usernames[index] }, { role: roles[index], active: actives[index] });
    }
    res.status(200).redirect("/dashboard?page="+req.body.page);
});

module.exports = router;