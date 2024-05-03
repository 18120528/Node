'use strict';

// Import modules
const express = require('express');
const router = express.Router();
const fs=require('fs');
const path = require('path');
//custom middleware
const post = require("../../models/formPost");
const ifLoggin = require("../../middlewares/auth/authen");
const ifAdmin = require("../../middlewares/auth/admin");
const ifAuthorized=require('../../middlewares/auth/author');
// Set up middleware
router.use(ifLoggin);
// 
router.get("/", (req, res) => {
    res.status(200).render("profile/myProfile");
});

// Export this module
module.exports = router;