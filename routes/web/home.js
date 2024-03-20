'use strict'
//import modules
const express=require('express');
const router=express.Router();
const fs=require('fs').promises;
//
router.get('/',async(req,res)=>
{
    //res.status(200).send(await fs.readFile('resource/home.html','utf-8'));
    await res.status(200).render("home/index");
});
router.get('/about',async(req,res)=>
{
    await res.status(200).send('18120528-Nguyen Nhu Quang');
});
router.get('/login',async(req,res)=>
{
    await res.status(200).render('home/login');
});
router.get('/signup',async(req,res)=>
{
    await res.status(200).render('home/signup');
});
//export this module
module.exports=router;
