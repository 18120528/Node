// comment.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    content: { type: String, required: true },
    author: { type: String, required: true },
    createDate: { type: Date, default: Date.now }
});

const Comment = mongoose.model('comments', commentSchema);

module.exports = Comment;
