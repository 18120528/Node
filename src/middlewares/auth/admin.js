'use strict';

const post = require("../../models/formPost");

// Middleware function to check if the user is authorized to edit the post
async function ifAmin(req, res, next) 
{
    if(req.user.username==='admin')
    {
        next();
    }
    else
    {
        try 
        {
            // Check if the user is the owner of the post
            if (req.body._method==='POST') 
            {
                next();
            } else 
            {
                // User is not admin, send a 403 Forbidden response
                req.flash("error", "Forbidden! You don't have the authorize");
                res.redirect("/post/" + req.params.postID);
            }
        } catch (error) 
        {
            // Handle any errors that occur (e.g., post not found)
            req.flash("error", error);
            res.redirect("/post/" + req.params.postID);
        }
    }
}

module.exports=ifAmin;