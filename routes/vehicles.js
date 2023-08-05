const express = require('express');
const router = express.Router();
const fs = require('fs');
const User = require('../models/users.js');
const Ev = require('../models/ev.js');

router.get("/evdb", function(req, res) {
  var total_users;

  User.countDocuments().then((count) => {
    total_users = count;
  }).catch((err) => {
    console.log(err);
  });

  if (req.isAuthenticated()) {
    User.findById(req.user.id)
      .then((user) => {
        if (user) {
          var data = user.data;
          var vehicles = [];

          var promises = data.map((vehicle) => {
            return Ev.find({
                vehicle: vehicle
              })
              .then((result) => {
                //console.log(result);
                if (result.length > 0) {
                  vehicles.push(result);
                } else {
                  // Remove the vehicle from the data array
                  data = data.filter((v) => v !== vehicle);
                }
              })
              .catch((err) => console.log(err));
          });

          Promise.all(promises)
            .then(() => {
              //console.log(vehicles, data);
              var sortedData = data.map((vehicle) => {
                var foundVehicle = vehicles.find((v) => v[0].vehicle === vehicle);
                return foundVehicle ? foundVehicle[0] : null;

              });
              res.render("home", {
                recent_vehicles: data,
                vehicle_data: sortedData,
                user_count: total_users
              });
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          console.log('User not found');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    res.redirect("/login");
  }
});


router.get("/requirements", function(req, res) {

  if (req.isAuthenticated()) {
    Ev.find({}, {
      company: 1,
      _id: 0
    }).then(
      (result) => {
        var comp_names = [];
        result.forEach(function(each) {
          comp_names.push(each);
        })
        res.render("index", {
          companies: comp_names
        });
        //console.log(comp_names)
      }
    ).catch(
      (err) => {
        console.log(err);
      }
    )
  } else {
    res.redirect("/login");
  }

});


router.post("/data", function(req, res) {
  var comp = req.body.company;
  var pri = req.body.price;
  //console.log(req.params.username);
  if (pri != "any") {
    pri = pri * 1000;
  } else if (pri == "any") {
    pri = 10000000
  }
  var ran = req.body.range;
  if (ran == "any") {
    ran = 0
  }
  var spd = req.body.speed;
  if (spd == "any") {
    spd = 0
  }
  //console.log(comp,pri,ran,spd);

  if (req.body.showall == 'showall') {
    Ev.find().then(
      (result) => {
        var data = [];
        result.forEach(function(each) {
          //console.log(each);
          data.push(each);
        })
        res.render("dbtable", {
          evdb: data
        });
      }
    ).catch(
      (err) => {
        console.log(err);
      })
  } else if (comp == 'any') {
    Ev.find({
      price: {
        $lte: pri
      },
      range: {
        $gte: ran
      },
      speed: {
        $gte: spd
      }
    }).then(
      (result) => {
        var data = [];
        result.forEach(function(each) {
          //console.log(each);
          data.push(each);
        })
        res.render("dbtable", {
          evdb: data
        });
      }
    ).catch(
      (err) => {
        console.log(err);
      })
  } else if (pri != 126000) {

    Ev.find({
      company: comp,
      price: {
        $lte: pri
      },
      range: {
        $gte: ran
      },
      speed: {
        $gte: spd
      }
    }).then(
      (result) => {
        var data = [];
        result.forEach(function(each) {
          //console.log(each);
          data.push(each);
        })
        res.render("dbtable", {
          evdb: data
        });
      }
    ).catch(
      (err) => {
        console.log(err);
      })
  } else {
    Ev.find({
      company: comp,
      price: {
        $gte: pri
      },
      range: {
        $gte: ran
      },
      speed: {
        $gte: spd
      }
    }).then(
      (result) => {
        var data = [];
        result.forEach(function(each) {
          //console.log(each);
          data.push(each);
        })
        res.render("dbtable", {
          evdb: data
        });
      }
    ).catch(
      (err) => {
        console.log(err);
      })
  }
  var body = '';
  filePath = __dirname + "/views/dbtable.ejs";
  req.on('data', function(data) {
    body += data;
  });

  req.on('end', function() {
    fs.appendFile(filePath, body, function() {
      res.end();
    });
  });
});



router.route("/vehicle_info/:vehicle")

  .get(function(req, res) {
    if (req.isAuthenticated()) {
      const user = req.user;
      //console.log(user,req.params.vehicle);

      User.updateOne({
          _id: req.user.id
        }, {
          $addToSet: {
            data: req.params.vehicle
          }
        })
        .then(() => {
          return User.updateOne({
            _id: req.user.id
          }, {
            $push: {
              data: {
                $each: [],
                $slice: -3
              }
            }
          });
        })
        .then((result) => {
          //console.log(result);
        })
        .catch((err) => {
          console.log(err);
        });

      Ev.find({
        vehicle: req.params.vehicle
      }).then(
        (result) => {
          //console.log(result);
          var vehicle_info = [];
          result.forEach(function(each) {
            vehicle_info.push(each);
          })
          res.render("vehicle_info", {
            ev_info: vehicle_info
          });
        }
      ).catch(
        (err) => {
          console.log(err);
        })
    } else {
      res.redirect("/login");
    }
    // console.log(req.params.vehicle);

  })

module.exports = router
