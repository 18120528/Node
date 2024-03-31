'use strict'
//import modules
const express=require('express');
const router=express.Router();

var ifLoggin =require("../../middlewares/auth/auth");
var post = require("../../models/formPost");
//middleware
router.use(ifLoggin);
//post page
router.get("/", async (req,res)=>
{
    post.find({UserID: req.user._id}
        ).then((postList)=>
        {
            res.status(200).render("posts/post",{postList});
        }).catch((err)=>
        {
            if(err)
            {
                req.flash("error", err);
                res.redirect("/post");
            }
        });
});
//add
router.get("/add", async (req,res)=>
{
    res.status(200).render("posts/addpost");
});
router.post("/add", async (req,res)=>
{
    if(!req.body.title)
    {
        req.flash("error", "Title can not be empty!!!");
        res.redirect("add");//no "/" = current
    }
    else
    {
        post.create({
            title: req.body.title,
            content: req.body.content,
            author: req.user.username,
            UserID: req.user._id
        }).then((posted)=>
        {
            if(posted)
            {
                req.flash("info", "Success!");
                res.redirect("/post");//get<=> route of use, redirect=> start over
            }
        }).catch((err)=>
        {
            req.flash("error", err);
            res.redirect("add");//get<=> route of use, redirect=> start over
        });
    }
});
//export this module
module.exports=router;