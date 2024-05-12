'use strict';

// Import modules
const express = require('express');
const router = express.Router();
const fs=require('fs');
//custom middleware
const User = require("../../models/users");
const Posts = require("../../models/formPost");
const Session = require("../../models/activeSession");
const upload=require('../../middlewares/upload/uploadImage');
const ifLoggin = require("../../middlewares/auth/authen");
const ifAdmin = require("../../middlewares/auth/admin");
const ifAuthorized=require('../../middlewares/auth/author');
// Set up middleware
router.use(ifLoggin);
//Get Dashboard 
router.get("/", ifAdmin, async (req, res) => {
    let users=await User.find();
    let posts=await Posts.find();
    let sessions=await Session.find();
    //Page for users
    let pageNum = parseInt(req.query.page) || 1;
    let startIndex = (pageNum - 1) * 10;
    let endIndex = startIndex + 10;
    let partedUsers=users.slice(startIndex, endIndex); 
    res.status(200).render('dashboard/dashboard-home',{users: partedUsers, pageNum, max: Math.ceil(users.length/10), posts, sessions});
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
// Export this module //TODO Delete image
module.exports = router;