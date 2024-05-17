'use strict'
//import modules
const express=require('express');
const router=express.Router();
const fs=require('fs').promises;
//
router.get('/', (req,res)=>
{
    res.status(200).send("{<br>LIST:<br>users<br>...<br>}");
});
module.exports=router;
