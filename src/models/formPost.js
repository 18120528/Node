var mongoose = require('mongoose');

var postSchema=new mongoose.Schema({
    title: {type: String, required: true},
    content: {type: String, require: false},
    author: {type: String, require: true},
    createDate: {type: Date, default: Date.now},
    image: {type: String, required: false},
    UserID: {type: mongoose.Schema.Types.ObjectId, required: false},
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'comments' }],
    Public: {type: Boolean, default:false, required: false}
});
//
var post=mongoose.model("posts",postSchema);
//
module.exports=post;