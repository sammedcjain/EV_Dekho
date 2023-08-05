require('dotenv').config()
const https = require("https");
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require('mongoose-findorcreate')
const app = express();
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require("bcrypt");
const flash = require('connect-flash');

fs = require('fs'),
url = require('url');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
app.set('view engine', 'ejs');

//authentication ==
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  // cookie: { secure: true }
}))

const passport = require('./others/passport_config.js');

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// mongoose.connect("mongodb+srv://sammedcjain:mongodb8762@cluster0.gldyajt.mongodb.net/evolvedb",{useNewUrlParser:true});
// mongoose.connect("mongodb://127.0.0.1:27017/evolvedb",{useNewUrlParser:true});
// mongoose.connect("mongodb://127.0.0.1:27017/usersDB",{useNewUrlParser:true});
const Ev = require('./models/ev.js');
const User = require('./models/users.js');

app.get('/auth/google',
  passport.authenticate('google', {
    scope: ['profile']
  }));

app.get('/auth/google/evdb',
  passport.authenticate('google', {
    failureRedirect: '/login'
  }),
  function(req, res) {
    // Successful authentication, redirect secrets.
    res.redirect('/evdb');
  });

app.get("/", function(req, res) {
  var user=0
  if (req.isAuthenticated()) {
    user=1
  } else {
    user=0
  }
  res.render("landing",{user});
});

const Authentication = require("./routes/auth.js");
app.use("/", Authentication);

const Admin_modification = require("./routes/admin_modification.js");
app.use("/", Admin_modification);

const initial_data = module.require("./others/inital_data_entry.js")

const Vehicles = require("./routes/vehicles.js");
app.use("/", Vehicles);

const Calculate = require("./routes/calculate.js");
app.use("/", Calculate);

const Compare = require("./routes/compare.js");
app.use("/", Compare);

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server has started successfully");
});
