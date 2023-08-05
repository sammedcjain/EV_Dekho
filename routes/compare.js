const express = require('express');
const router = express.Router();
const Ev = require('../models/Ev');

router.get("/compare", function(req, res) {
  Ev.find({}, {
    vehicle: 1,
    _id: 0
  }).then(
    (result) => {
      var ev_names = [];
      result.forEach(function(each) {
        ev_names.push(each);
      })
      res.render("comparision", {
        EV_names: ev_names
      });
    }
  ).catch(
    (err) => {
      console.log(err);
    }
  )

});

router.post("/compare/:vehicle1/:vehicle2/:vehicle3?", function(req, res) {
  let vehicle1 = req.params.vehicle1;
  let vehicle2 = req.params.vehicle2;
  let vehicle3 = req.params.vehicle3;

  let vehicles = [vehicle1, vehicle2];

  if (vehicle3) {
    vehicles.push(vehicle3);
  }
  var length = vehicles.length;
  if (length == 2) {
    Ev.find({
      vehicle: {
        $in: [vehicle1, vehicle2]
      }
    }).then(
      (result) => {
        res.render("vehicle_comparision", {
          vehicle_data: result
        });
      }
    ).catch(
      (err) => {
        console.log(err);
      }
    )
  } else if (length == 3) {
    Ev.find({
      vehicle: {
        $in: [vehicle1, vehicle2, vehicle3]
      }
    }).then(
      (result) => {
        res.render("vehicle_comparision", {
          vehicle_data: result
        });
      }
    ).catch(
      (err) => {
        console.log(err);
      }
    )
  }

});

module.exports = router
