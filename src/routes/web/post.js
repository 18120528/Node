'use strict';

// Import modules
const express = require('express');
const router = express.Router();
const fs=require('fs');
const path = require('path');
//custom middleware
const post = require("../../models/formPost");
const Cmt = require("../../models/comment");
const ifLoggin = require("../../middlewares/auth/authen");
const upload=require('../../middlewares/upload/uploadImage');
const ifAuthorized=require('../../middlewares/auth/author');
// Set up middleware
router.use(ifLoggin);
// Post page
router.get("/", async (req, res) => {
    try {
        const postList = await post.find({ UserID: req.user._id }).sort({ createDate: -1 });
        res.status(200).render("posts/myPost", { postList });
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
        let img="";
        if(req.file)
        {
            img=req.file.path;
        }
        const posted = await post.create({
            title: req.body.title,
            content: req.body.content,
            author: req.user.username,
            UserID: req.user._id,
            image: img
        });

        if (posted) {
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
        let Post = await post.findById(req.params.postID).populate('comments');
        res.render("posts/singlePost", { Post });
    } catch (err) {
        req.flash("error", "This post does not exist!!!");
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
    //Update
    if(req.body._method==='PUT')
    {
        try {
            let Post = await post.findById(req.params.postID);
            fs.unlink(Post.image, (err) => //local
            {
                if (err) {
                    console.error('Error removing image:', err);
                }
            });
            let img="";
            if(req.file)
            {
                img=req.file.path;
            }
            await Post.updateOne({ title: req.body.title, content: req.body.content, image: img });
            res.redirect("/post/" + req.params.postID);
        } catch (err) {
            if (err) {
                req.flash("error", err.message);
                res.redirect("/post/");
            }
        }
    }
    //Delete
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
            await post.findByIdAndDelete(req.params.postID);//db
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
router.post('/:postID/comment', ifAuthorized, async (req, res) =>//Post comment 
{
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
                res.redirect("/post/" + req.params.postID);
            } catch (err) 
            {
                if (err) {
                    req.flash("error", err.message);
                    res.redirect("/post/");
                }
            }
        }
});
// Export this module
module.exports = router;
