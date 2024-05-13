'use strict';

// Import modules
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
//
const path = require('path');
const mongoose = require('mongoose');
const uri = require('./models/remote/mongoProfile');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const passport = require("passport");
const setUpPassport = require('./configs/passportStrategy');
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const cors = require("cors");
const favicon = require('serve-favicon');
const User=require('./models/users');
// Init
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Connect to the database
mongoose.connect(uri);
setUpPassport();
// Middleware
app.use(cors());
app.use(cookieParser());
const sessionMiddleware =session({
    secret: process.env.SESSION_SECRET || "ronnnq18120528hcmus",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: uri,
        ttl: 7200 // Set TTL to 1 hour (in seconds)
    }),
    cookie: {
        maxAge: 7200000, // Expiration time for the session cookie (1 hour in milliseconds)
        secure: false, // Adjust as needed
        sameSite: 'strict' // Adjust as needed
    }
});
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Parse incoming request bodies
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
//
const users = {};
const connection= {};

io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next); // Pass session data to Socket.IO
});

io.on('connection', (socket) => {
    const userID = socket.request.session.passport.user||null; // Get user ID from session
    // Store the socket associated with the user ID
    users[userID] = socket;
    connection[userID]=socket.handshake.query.userID;
    socket.on('disconnect', () => {
        delete users[userID]; // Remove the socket when user disconnects
        delete connection[userID];
    });

    socket.on('private message', async ({ recipientId, message }) => {//recipientId: destination
        const recipientSocket = users[recipientId];
        if (connection[recipientId]) {
            // Send the private message to the recipient
            if(userID===connection[recipientId])
            {
                recipientSocket.emit('private message', { userID: userID.toString(), message });
            }
            else
            {
                socket.emit('private message', { message: "I'm Busy!!!" });
            }
        } else 
        {
            if(recipientSocket)
            {
                let user=await User.findById(userID);
                recipientSocket.emit('start chat', { senderName: user.username });
                socket.emit('private message', { message: 'Start:' });
            }
            else
            {
                socket.emit('private message', { message: 'The user is offline!' });
            }
        }
    });
});
// Set up view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// Define your routes
app.use('/src/upload/images', express.static(path.join(__dirname, '/upload/images')));
app.use(favicon(path.join(__dirname, '/upload/resource/favicon.ico')));
app.use('/', require('./routes/web/index'));
app.use('/api', require('./routes/api/index'));
// Start the server
const PORT = 9000;
server.listen(process.env.PORT || PORT, () => {
    console.log(`Server is running at Port: ${process.env.PORT || PORT}`);
});
