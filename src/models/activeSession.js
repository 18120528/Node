const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema(
    {
        userID: { type: String, required: true },
        sessionID: { type: String, required: true },
    }, 
    {
        expires: 7200, // 2 hours * 60 minutes * 60 seconds
    });

const Session = mongoose.model('active_sessions', sessionSchema);

module.exports = Session;