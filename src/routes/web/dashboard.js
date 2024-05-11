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
    res.status(200).render('dashboard/dashboard-home',{users, posts, sessions});
});
//Update Roles
router.post("/role", ifAdmin, async(req,res)=> {
    let usernames=req.body.username;
    let actives=req.body.active;
    let roles=req.body.role;
    await usernames.forEach(async (username, index)=>
    {
        await User.updateOne({username: username}, {role: roles[index], active: actives[index]});
    });
    res.status(200).redirect("/dashboard");
});
// Export this module //TODO Delete image
module.exports = router;