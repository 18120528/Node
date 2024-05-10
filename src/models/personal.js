'use strict'

var mongoose = require("mongoose");
//
var personalSchema = new mongoose.Schema(
{
    log: [{type:String}],
    notify:{type: Boolean, default: true},
    darkMode: {type: Boolean, default: false} 
});
//
var personals=mongoose.model("personals",personalSchema);
module.exports=personals;