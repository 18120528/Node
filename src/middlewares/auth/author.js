'use strict';

const post = require("../../models/formPost");

// Middleware function to check if the user is authorized to edit the post
async function ifAuthorized(req, res, next) {
    try {
        const Post = await post.findById(req.params.postID);

        // Check if the user is the owner of the post
        if (Post.UserID.equals(req.user._id)) {
            // User is authorized to edit the post, proceed to the next middleware or route handler
            return next();
        } else {
            // User is not authorized, send a 403 Forbidden response
            req.flash("error", "Forbidden! You don't have the authorize");
            res.redirect("/");
        }
    } catch (error) {
        // Handle any errors that occur (e.g., post not found)
        req.flash("error",error);
        res.redirect("/");
    }
}

module.exports=ifAuthorized;