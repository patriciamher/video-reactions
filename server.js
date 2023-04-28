// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
//process.env for hosting env
var port     = process.env.PORT || 8080;
const MongoClient = require('mongodb').MongoClient
//another way to talk to database- uses schemas/like constructor- spits out obj with design(blue print of whats going into database)
var mongoose = require('mongoose');
//handles authentication(dont have to think about it just works)
var passport = require('passport');
//error message
var flash    = require('connect-flash');
//logger- logs all request
var morgan       = require('morgan');
//lets use look at cookies- keeps you logged in
var cookieParser = require('cookie-parser');
//let us look at post req and get data out of form
var bodyParser   = require('body-parser');
//helps keep open login session- stays logged in 
var session      = require('express-session');
//go to config folder and find db.js(exports object) file
var configDB = require('./config/database.js');//./config/database.js- holds obj
//sets global variable to db
var db

// configuration ===============================================================
//configDB.url- url inside object
mongoose.connect(configDB.url, (err, database) => {
  if (err) return console.log(err)
  db = database
  //app- express
  //runs route function
  require('./app/routes.js')(app, passport, db);
}); // connect to our database
//function call would look like call(passport/function)
//get the config folder and find passport file and run the function passport
require('./config/passport')(passport); // pass passport for configuration

//sets up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
//setting public folder so they can be servered
app.use(express.static('public'))

//all views in ejs
app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport- helps randomizes password
app.use(session({
    secret: 'rcbootcamp2023a', // session secret
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
