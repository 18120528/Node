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
// Init
const app = express();
const server = http.createServer(app);
const io = new Server(server);
io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
      io.emit('chat message', msg);
    });
  });
// Connect to the database
mongoose.connect(uri);
setUpPassport();
// Middleware
app.use(cors());
app.use(cookieParser());
app.use(session({
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
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Parse incoming request bodies
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
// Set up method override middleware using '_method' query parameter

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
