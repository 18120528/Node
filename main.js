'use strict'
//import modules
const express=require('express');
const fs=require('fs').promises;
const app=express();
const path = require('path');
//import route

//Middleware
app.use(express.json());
app.use('/',require('./routes/web/index'));
app.use('/api',require('./routes/api/index'));
//
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');
console.log(__dirname)
const PORT=9000;
app.listen(process.env.PORT||PORT,()=>
{
    console.log(`Server is running at Port: ${process.env.PORT||PORT}`);
});


