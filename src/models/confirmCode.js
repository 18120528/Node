var mongoose = require('mongoose');

var confirmCodeSchema=new mongoose.Schema({
    code: {type: String, required: true},
    userID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'users' },
});
//
var confirmCode=mongoose.model("confirmcodes",confirmCodeSchema);
//
module.exports=confirmCode;