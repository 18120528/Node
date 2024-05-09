const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sessionSchema = new Schema({
    userID: { type: String, required: true },
    sessionID: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 7200}
});

const Session = mongoose.model('active_sessions', sessionSchema);

module.exports = Session;
