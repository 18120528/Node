const mongoose = require('mongoose');
<<<<<<< HEAD
const Schema = mongoose.Schema;

const sessionSchema = new Schema(
    {
        userID: { type: String, required: true },
        sessionID: { type: String, required: true },
        expiresAt: { type: Date, default: Date.now() + 2 * 60 * 60 * 1000 } // 2 hours in milliseconds
=======

const sessionSchema = new mongoose.Schema(
    {
        userID: { type: String, required: true },
        sessionID: { type: String, required: true },
    }, 
    {
        expires: 7200, // 2 hours * 60 minutes * 60 seconds
>>>>>>> 2266049793faa4274b6f5eb7cbc86f64467c3885
    });

const Session = mongoose.model('active_sessions', sessionSchema);

module.exports = Session;