'use strict'
//check if logged in
module.exports= function ifLoggin(req, res, next)
{
    if(req.isAuthenticated())
    {
        next();
    }
    else
    {
        req.flash("info", "You must login first!");
        res.redirect("/login");
    }
}