'use strict';

// Import modules
const express = require('express');
const router = express.Router();
const fs=require('fs');
//custom middleware
const post = require("../models/formPost");
const Cmt = require("../models/comment");
const User = require("../models/users");
const upload=require('../middlewares/upload/uploadImage');
const ifLoggin = require("../middlewares/auth/authen");
const ifMod = require("../middlewares/auth/mod");
const ifAuthorized=require('../middlewares/auth/author');
// Set up middleware
router.use(ifLoggin);
// Post page
router.get("/", async (req, res) => {
    try {
        let pageNum = parseInt(req.query.page) || 1;
        let pageSize = 15;
        let skip = (pageNum - 1) * pageSize;
        // Fetch the required subset of records
        let postList = await post.find().sort({ createDate: -1 }).skip(skip).limit(pageSize);
        // Count the total number of documents to calculate the maximum number of pages
        let totalPosts = await post.countDocuments();
        let maxPages = Math.ceil(totalPosts / pageSize);
        //
        res.status(200).render("posts/myPost", {
        postList,
        pageNum,
        max: maxPages
        });
    } catch (err) {
        if (err) {
            req.flash("error", err.message);
            res.redirect("/post");
        }
    }
});
// Add
router.get("/add", (req, res) => {
    res.status(200).render("posts/addpost");
});
//
router.post("/add", upload.single('image'), async (req, res) => {
    try {
        let image="";
        if(req.file)
        {
            image=req.file.path;
        }
        const posted = await post.create({
            title: req.body.title,
            content: req.body.content,
            author: req.user.username,
            UserID: req.user._id,
            image: image
        });

        if (posted) 
        {
            //Save to Log
            let user=await User.findOne({username: req.user.username}).populate({path: 'personalID'});
            let currentDate = new Date();
            let content = `Created post: ${posted._id} at ${currentDate.getHours()}:${currentDate.getMinutes()}, ${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
            user.personalID.log.push(content);
            user.personalID.save();
            req.flash("info", "Success!");
            res.redirect("/post");
        }
    } catch (err) {
        if (err) {
            req.flash("error", err.message);
            res.redirect("/post");
        }
    }
});

// Access
router.get('/:postID', async (req, res) => {
    try {
        let pageNum = parseInt(req.query.page) || 1;
        let pageSize = 20;
        let skip = (pageNum - 1) * pageSize;
        // Fetch the required subset of records
        let Post = await post.findById(req.params.postID).populate({ path: 'comments', options: { sort: { createDate: -1 } } });
        let comments = Post.comments;
        // Count the total number of documents to calculate the maximum number of pages
        let maxPages = Math.ceil(comments.length / pageSize);
        comments=comments.slice(skip, skip + pageSize);
        //
        res.status(200).render("posts/singlePost", {
        Post,
        comments,
        pageNum,
        max: maxPages
        });      
    } catch (err) {
        req.flash("error", err);
        res.redirect("/post");
    }
});

//Get Edit page
router.get('/:postID/edit', ifAuthorized, async (req, res) => {
    try {
        const Post = await post.findById(req.params.postID);
        res.render("posts/editPost", { Post });
    } catch (err) {
        req.flash("error", "This post does not exist to edit!!!");
        res.redirect("/post");
    }
});
//Edit
router.post('/:postID', ifAuthorized, upload.single('image') ,async (req, res) => {
    //Update a post
    if(req.body._method==='PUT')
    {
        try {
            let Post = await post.findById(req.params.postID);
            let image=Post.image;
            if(req.file)
            {
                image=req.file.path;
                fs.unlink(Post.image, (err) => //local
                {
                    if (err) {
                        console.error('Error removing image:', err);
                    }
                });                                                        
            }
            await Post.updateOne({ title: req.body.title, content: req.body.content, image: image });
            //Save to Log
            let user=await User.findOne({username: req.user.username}).populate({path: 'personalID'});
            let currentDate = new Date();
            let content = `Updated post: ${Post._id} at ${currentDate.getHours()}:${currentDate.getMinutes()}, ${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
            user.personalID.log.push(content);
            user.personalID.save();
            res.redirect("/post/" + req.params.postID);
        } catch (err) {
            if (err) {
                req.flash("error", err.message);
                res.redirect("/post/");
            }
        }
    }
    //Delete a post
    if(req.body._method==='DELETE')
    {
        try {
            let Post = await post.findById(req.params.postID);
            fs.unlink(Post.image, (err) => 
            {
                if (err) {
                    console.error('Error removing image:', err);
                }
            });
            await Cmt.findByIdAndDelete(Post.comments);
            await post.findByIdAndDelete(req.params.postID);//db
            //Save to Log
            let user=await User.findOne({username: req.user.username}).populate({path: 'personalID'});
            let currentDate = new Date();
            let content = `Deleted a post at ${currentDate.getHours()}:${currentDate.getMinutes()}, ${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
            user.personalID.log.push(content);
            user.personalID.save();
            res.redirect("/post/");
        } catch (err) {
            if (err) {
                req.flash("error", err.message);
                res.redirect("/post/");
            }
        }
    }
});
//comment
router.post('/:postID/comment', ifMod, async (req, res) =>//Post comment 
{
        //Create a comment
        if(req.body._method=='POST')
        {
            try 
            {
                const comment=await Cmt.create({
                    content: req.body.content,
                    author: req.user.username
                });
                await post.findByIdAndUpdate(
                    req.params.postID,
                    { $push: { comments: comment._id }
                });
                //Save to Log
                let user=await User.findOne({username: req.user.username}).populate({path: 'personalID'});
                let currentDate = new Date();
                let content = `Commented at post: ${req.params.postID} at ${currentDate.getHours()}:${currentDate.getMinutes()}, ${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
                user.personalID.log.push(content);
                user.personalID.save();
                res.redirect("/post/" + req.params.postID);
            } catch (err) 
            {
                if (err) {
                    req.flash("error", err.message);
                    res.redirect("/post/");
                }
            }
        }
        //Delete a comment
        if(req.body._method=='DELETE')
        {
            try 
            {
                let comment_Id=req.body.comment_Id;
                await post.findByIdAndUpdate(
                    req.params.postID,
                    { $pull: { comments: comment_Id } });
                await Cmt.findByIdAndDelete(comment_Id);
                //Save to Log
                let user=await User.findOne({username: req.user.username}).populate({path: 'personalID'});
                let currentDate = new Date();
                let content = `Deleted a comment at post: ${req.params.postID} at ${currentDate.getHours()}:${currentDate.getMinutes()}, ${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
                user.personalID.log.push(content);
                user.personalID.save();
                res.redirect("/post/" + req.params.postID);
            } catch (err)
            {
                if (err) {
                    req.flash("error", err.message);
                    res.redirect("/post/" + req.params.postID);
                }
            }
        }
});
// Export this module
module.exports = router;
