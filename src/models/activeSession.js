const mongoose = require('mongoose');
//
const Schema = mongoose.Schema;

const sessionSchema = new Schema(
    {
        userID: { type: String, required: true },
        sessionID: { type: String, required: true },
        expiresAt: { type: Date, default: Date.now() + 2 * 60 * 60 * 1000 } // 2 hours in milliseconds
    });
const Session = mongoose.model('active_sessions', sessionSchema);

module.exports = Session;