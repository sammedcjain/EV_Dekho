const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const flash = require('connect-flash');
const passport = require('passport');
const User = require('../models/users.js');
const Admin = require('../models/admin.js');

//user authentication =>

router.get("/register", function(req, res) {
  res.render('register', {
    messages: req.flash()
  });
});

router.post("/register", async (req, res) => {
  const {
    username,
    password
  } = req.body;
  try {
    // Check if the username is already taken
    const existingUser = await User.findOne({
      username
    });
    if (existingUser) {
      // Username is taken, set a flash message
      req.flash('error', 'Username is already taken');
      console.log("Username is already taken");
      return res.redirect('/register'); // Redirect back to the registration page
    } else {
      // Proceed with registration
      User.register({
        username: req.body.username
      }, req.body.password, function(err, user) {
        if (err) {
          console.log(err);
          req.flash('error', 'An error occurred during registration');
          return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function() {
          req.flash('success', 'Registration successful! You can now log in.');
          res.redirect("/evdb");
        });
      });
    }
  } catch (error) {
    console.log(error);
    req.flash('error', 'An error occurred.');
    res.redirect("/register");
  }
});

router.get("/login", function(req, res) {
  res.render("login", {
    messages: req.flash()
  });
});

router.post("/login", function(req, res, next) {
  passport.authenticate("local", function(err, user, info) {
    if (err) {
      console.log(err);
      return next(err); // Pass the error to the next middleware
    }
    if (!user) {
      req.flash('error', info.message);
      return res.redirect('/login');
    }
    req.logIn(user, function(err) {
      if (err) {
        console.log(err);
        return next(err);
      }
      return res.redirect("/evdb");
    });
  })(req, res, next);
});

router.get("/logout", function(req, res) {
  req.logout(function(err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  })
});

//admin authentication =>

router.get("/admin_registeration_Tony_De_Cost_Invite", function(req, res) {
  res.render("admin_registeration");
});

router.post("/admin_register", function(req, res) {
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    var user = req.body.username;
    var pass = hash;
    //console.log(pass);
    const newAdmin = new Admin({
      username: user,
      password: pass
    });
    newAdmin.save().then(
      (result) => {
        console.log("admins added succesfully");
        res.render("admin");
      }
    ).catch(
      (err) => {
        console.log(err);
      }
    )
  });
});

router.get("/authentication", function(req, res) {
  res.render("admin_authentication");
});

router.get("/fail", function(req, res) {
  res.render("auth_failed");
});

router.post("/admin_login", function(req, res) {
  var user = req.body.username;
  var pass = req.body.password;

  Admin.findOne({
    username: user
  }).then(
    (result) => {
      console.log("login credentials found");
      //console.log("results ="+result);
      bcrypt.compare(pass, result.password, function(err, presult) {
        if (presult == true) {
          res.render("admin");
        } else {
          res.redirect("/fail");
          console.log("Password validation unsuccessful");
        }
      });
    }
  ).catch(
    (err) => {
      console.log(err);
    }
  )
});


module.exports = router
