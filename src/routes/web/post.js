'use strict';

// Import modules
const express = require('express');
const router = express.Router();
const fs=require('fs');
const path = require('path');
//custom middleware
const post = require("../../models/formPost");
const ifLoggin = require("../../middlewares/auth/auth");
const upload=require('../../middlewares/upload/uploadImage');
// Set up middleware
router.use(ifLoggin);
// Post page
router.get("/", async (req, res) => {
    try {
        const postList = await post.find({ UserID: req.user._id });
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
        const Post = await post.findById(req.params.postID);
        res.render("posts/singlePost", { Post });
    } catch (err) {
        req.flash("error", "This post does not exist!!!");
        res.redirect("/post");
    }
});

// Edit page
router.get('/:postID/edit', async (req, res) => {
    try {
        const Post = await post.findById(req.params.postID);
        res.render("posts/editPost", { Post });
    } catch (err) {
        req.flash("error", "This post does not exist to edit!!!");
        res.redirect("/post");
    }
});
//Edit
router.post('/:postID',upload.single('image') ,async (req, res) => {
    if(req.body._method==='PUT')
    {
        try {
            let Post = await post.findById(req.params.postID);
            if(Post.image)//local
            {
                fs.unlink(Post.image, (err) => 
                {
                    if (err) {
                        console.error('Error removing image:', err);
                    }
                });
            }
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
    if(req.body._method==='DELETE')
    {
        try {
            let Post = await post.findById(req.params.postID);
            if(Post.image)//img
            {
                fs.unlink(Post.image, (err) => 
                {
                    if (err) {
                        console.error('Error removing image:', err);
                    }
                });
            }
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

// Export this module
module.exports = router;
