'use strict';

// Import modules
const express = require('express');
const router = express.Router();
const fs=require('fs');
//custom middleware
const user = require("../../models/users");
const upload=require('../../middlewares/upload/uploadImage');
const ifLoggin = require("../../middlewares/auth/authen");
const ifAdmin = require("../../middlewares/auth/admin");
const ifAuthorized=require('../../middlewares/auth/author');
// Set up middleware
router.use(ifLoggin);
//Get Dashboard 
router.get("/", ifAdmin, async (req, res) => {
    let users=await user.find();
    res.status(200).render('dashboard/dashboard-home',{users});
});
//Update Roles
router.post("/role", ifAdmin, async(req,res)=> {
    let usernames=req.body.username;
    let actives=req.body.active;
    let roles=req.body.role;
    await usernames.forEach(async (username, index)=>
    {
        await user.updateOne({username: username}, {role: roles[index], active: actives[index]});
    });
    res.status(200).redirect("/dashboard");
});
// Export this module //TODO Delete image
module.exports = router;