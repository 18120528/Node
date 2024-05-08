'use strict';

// Import modules
const express = require('express');
const router = express.Router();
const fs=require('fs');
//custom middleware
const users = require("../../models/users");
const upload=require('../../middlewares/upload/uploadImage');
const ifLoggin = require("../../middlewares/auth/authen");
const ifAuthorized=require('../../middlewares/auth/author');
// Set up middleware
router.use(ifLoggin);
//Default routing 
router.get("/", (req, res) => {
    res.redirect(`/profile/${req.user.username}`);
});
//Get user profile
router.get('/:username',async (req,res)=>{
    let user= await users.findOne({username: req.params.username});
    res.status(200).render("profile/profile-home",{user});
})
router.post('/:username', ifAuthorized, upload.single('image'), async (req,res)=>
{
    try 
    {
        let user=await users.findOne({username: req.params.username});
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
        await users.updateOne({ username: req.params.username }, { $set: { bio: req.body.bio, image: image } });//if  1 element=undefined=>not update
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
// Export this module //TODO ROLES
module.exports = router;