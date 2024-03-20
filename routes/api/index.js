'use strict'
//import modules
const express=require('express');
const router=express.Router();
const fs=require('fs').promises;
//
router.use('/users',require('./users'))
router.get('/',async (req,res)=>
{
    //res.status(200).send(await fs.readFile('resource/home.html','utf-8'));
    await res.status(200).send("{<br>LIST:<br>users<br>...<br>}");
});
module.exports=router;
