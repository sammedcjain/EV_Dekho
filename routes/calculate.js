const express = require('express');
const router = express.Router();


router.get("/calculator", function(req, res) {
  if (req.isAuthenticated()) {
    res.render("call");
  } else {
    res.redirect("/login");
  }

});

router.post("/calculatorres", function(req, res) {
  var distance = req.body.distance;
  var milage = req.body.milage;
  var petrol = req.body.petrol;
  var service = req.body.service;
  var charges = req.body.charges;
  var key = req.body.key;
  var vehicle = req.body.vehicle_type;
  //console.log(vehicle);
  if (key == 1) {
    var consumption = req.body.consumption;
    var range = req.body.range;
  } else {
    var consumption = 3;
    var range = 100;
  }


  // for petrol
  let kms = distance * 365;

  let ltrs = kms / milage;

  let petrol_total = petrol * ltrs;

  let petrol_Total = parseFloat(petrol_total) + parseFloat(service);

  // for ev
  // cost per charge
  let cpc = consumption * charges;
  let total_num_charges = kms / range;
  let cpy = total_num_charges * cpc;

  let final = petrol_Total - cpy;

  if (vehicle == "Diesel") {
    var fcarbon = 2.68 * ltrs;
  } else if (vehicle == "Petrol") {
    var fcarbon = 2.31 * ltrs;
  }

  let total_consumption_year = consumption * total_num_charges;
  var ecarbon = 0.684 * total_consumption_year;
  var carbon = fcarbon - ecarbon;
  var evdb_specific = {
    petrol_Total: petrol_Total,
    cpy: cpy,
    total: final,
    fcarbon: fcarbon,
    ecarbon: ecarbon,
    carbon: carbon,
    vehicle: vehicle
  };
  res.render("cal", {
    evcal: evdb_specific
  });

});

module.exports = router
