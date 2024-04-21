'use strict';

// Import modules
const express = require('express');
const fs = require('fs').promises;
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
// Connect to the database
const app = express();
mongoose.connect(uri);
setUpPassport();

// Middleware
app.use(cors());
app.use(cookieParser());
app.use(session({ // for authentication session
    secret: "ronnnq18120528hcmus",//should be environment var
    resave: false,//change only
    saveUninitialized: false,//true if save personal like shopping cart
    store: MongoStore.create({mongoUrl:uri}),
    cookie: { 
        expires: new Date(new Date().setHours(23, 59, 59, 999)) // End of the current day
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
app.use('/', require('./routes/web/index'));
app.use('/api', require('./routes/api/index'));

// Start the server
const PORT = 9000;
app.listen(process.env.PORT || PORT, () => {
    console.log(`Server is running at Port: ${process.env.PORT || PORT}`);
});
