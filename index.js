'use strict'
//add modules
const express=require('express');
const fs=require('fs').promises;
//create  object
const app=express();
//middleware
app.use(express.json());
//Listen
app.listen(process.env.PORT||8888,()=>
{
    console.log(`Server is running on PORT: ${process.env.PORT||8888}`);
});
//
async function sendHTML(path,res)
{
    try
    {
        res.status(200).send(await fs.readFile(path,'utf-8'))
    }
    catch(err)
    {
        console.log(err)
        res.status(500).send('Internal Server Error!')
    }
}
//GET
app.get('/',async (req,res)=>
{
    await sendHTML('./home.html',res);
});
app.get('/user',async (req,res)=>
{
    await sendHTML('./user.html',res);
});
const IDlist = {1: 'quang', 2:'quynh'};
async function sendAtribute(id,res)
{
    await res.status(200).send(IDlist[id])
}
app.get('/user/:id',async (req,res)=>
{
    const{id}=req.params
    await sendAtribute(id,res);
});
//POST

//PUT

//DELETE