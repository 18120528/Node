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
    await post.find({UserID: req.user._id}
        ).then((postList)=>
        {
            res.status(200).render("posts/myPost",{postList});
        }).catch((err)=>
        {
            if(err)
            {
                req.flash("error", err.message);
                res.redirect("/post");
            }
        });
});
//add
router.get("/add", (req,res)=>
{
    res.status(200).render("posts/addpost");
});
router.post("/add", async (req,res)=>
{
    await post.create({
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
        if(err)
        {
            req.flash("error", err.message);
            res.redirect("/post");
        }
    });
});
//postID
router.get('/:postID',async (req, res)=>
{
    await post.findById(req.params.postID).then((Post)=>
    {
        res.render("posts/singlePost",{Post});
    }).catch((err)=>
    {
        req.flash("error", "This post does not exist!!!");
        res.redirect("/post");
    });
});
//edit
router.get('/edit/:postID',async (req, res)=>
{
    await post.findById(req.params.postID).then((Post)=>
    {
        res.render("posts/editPost",{Post});
    }).catch((err)=>
    {
        req.flash("error", "This post does not exist to edit!!!");
        res.redirect("/post");
    });
});
router.post('/edit/:postID',async (req, res)=>
{
    await post.findById(req.params.postID).then(async (Post)=>
    {
        await Post.updateOne({title: req.body.title, content: req.body.content});
        res.redirect("/post/"+ req.params.postID);
    }).catch((err)=>
    {
        if(err)
        {
            req.flash("error", err.message);
            res.redirect("/post/");//postID=params, postid=hidden field
        }
    });
});
//export this module
module.exports=router;