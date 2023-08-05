const express = require('express');
var Ev = require('../models/ev.js');

const ev1=new Ev({
  vehicle_id:100,
  company: "Ola",
  vehicle: "Ola S1 Pro",
  price: 103827 ,
  Max_Power :8500,
  Rated_Power : 5500,
  Max_Torque: 58,
  Battery_capacity : 4,
  charge_consumption: 4,
  Battery_type : "Lithium Ion",
  No_of_Batteries : 1,
  range : 170,
  speed  : 116,
  Acceleration_0_to_60 : 4.5,
  Battery_charging_time :6.30,
  Fast_charging :"Yes",
  Riding_Modes : "Eco, Normal, Sport and Hyper",
  Transmission :"Automatic",
  Motor_type : "Mid Drive IPM",
  Portable_Battery :"No",
  Swappable_Battery : "No",
  Charger_Type : "Portable Charger",
  Carrying_capacity  :150,
  Overall_Width : 712,
  Overall_Height : 1160,
  Kerb_Weight : 125,
  Battery_warranty : "Unlimited Kilometers or 3 Year",
  Motor_warranty : " Whichever comes earlier, 40000 kms or 3 Year",
  Connectivity : "Bluetooth,WiFi",
  Navigation: "Yes",
  Operating_System : "MoveOS 2",
  Processor : "2.2 GHZ 8-Core",
  Mobile_Application : "Yes",
  other_features : "https://olaelectric.com/",

  colors :"Porcelain White, Khaki, Neo Mint, Coral Glam, Jet Black, Marshmellow, Liquid Silver, Millenial Pink, Anthracite Grey, Midnight Blue, Matt Black, Gerua",
  main_photo:"https://cdni.autocarindia.com/utils/imageresizer.ashx?n=https://cms.haymarketindia.net/model/uploads/modelimages/Ola-Electric-S1-Pro-010920211407.jpg",
  photo1:"https://media.zigcdn.com/media/content/2022/Aug/1104610888-olawarranty.jpg",
  photo2:"https://bd.gaadicdn.com/processedimages/ola-electric/s1-pro/source/s1-pro6405e7ddad95b.jpg",
  company_link:"https://olaelectric.com/",
  reviews:'<iframe width="680" height="500" src="https://www.youtube.com/embed/pq4U0Ah8ZwU" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>'
});

const ev2=new Ev({
  vehicle_id:101,
  company: "Ola",
  vehicle: "Ola S1",
  price: 99827,
  charge_consumption: 3,
  Max_Power :8500,
  Rated_Power : 5500,
  Max_Torque: 58,
  Battery_capacity : 4,
  charge_consumption: 4,
  Battery_type : "Lithium Ion",
  No_of_Batteries : 1,
  range : 141,
  speed  : 95,
  Acceleration_0_to_60 : 4.5,
  Battery_charging_time :6.30,
  Fast_charging :"Yes",
  Riding_Modes : "Eco, Normal, Sport and Hyper",
  Transmission :"Automatic",
  Motor_type : "Mid Drive IPM",
  Portable_Battery :"No",
  Swappable_Battery : "No",
  Charger_Type : "Portable Charger",
  Carrying_capacity  :150,

  Overall_Width : 712,
  Overall_Height : 1160,
  Kerb_Weight : 125,

  Battery_warranty : "Unlimited Kilometers or 3 Year",
  Motor_warranty : " Whichever comes earlier, 40000 kms or 3 Year",

  Connectivity : "Bluetooth,WiFi",
  Navigation: "Yes",
  Operating_System : "MoveOS 2",
  Processor : "2.2 GHZ 8-Core",
  Mobile_Application : "Yes",
  other_features : "https://olaelectric.com/",

  colors :"Jet Black, Matte Black, Gerua, Liquid Silver, Coral Glam, Anthracite Grey, Midnight Blue, Porcelain White, Marshmellow, Millenial Pink, Neo Mint",
  main_photo:"https://etimg.etb2bimg.com/photo/88918407.cms",
  photo1:"https://imgd.aeplcdn.com/1280x720/n/cw/ec/98491/s1-right-front-three-quarter-8.jpeg?isig=0&q=100",
  photo2:"https://images.firstpost.com/fpimages/1200x800/fixed/jpg/2021/11/ola-electric-reveals-date-for-second-purchase-window-s1-s1-pro-electric-scooter.jpg",
  company_link:"https://olaelectric.com/",
  reviews:'<iframe width="680" height="500" src="https://www.youtube.com/embed/xlumlnv-g7k" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>'
  });

const ev3=new Ev({
  vehicle_id:102,
  company: "Ola",
  vehicle: "Ola S1 Air",
  price: 84999  ,
  Max_Power :4500,
  Rated_Power : 2700,
  Max_Torque: 50,
  Battery_capacity : 2,
  charge_consumption: 4,
  Battery_type : "Lithium Ion",
  No_of_Batteries : 1,
  range : 87,
  speed  : 85 ,
  Acceleration_0_to_60 : 9.3,
  Battery_charging_time :4.3,
  Fast_charging :"Yes",
  Riding_Modes : "Eco, Normal, Sport",
  Transmission :"Automatic",
  Motor_type : "Hub Motor",
  Portable_Battery :"No",
  Swappable_Battery : "No",
  Charger_Type : "Portable Charger",
  Carrying_capacity  :150,
  Overall_Width : 710,
  Overall_Height : 1155,
  Kerb_Weight : 99,
  Battery_warranty : "3 Years",
  Motor_warranty : "3 Years",
  Connectivity : "Bluetooth,WiFi",
  Navigation: "Yes",
  Operating_System : "MoveOS 2",
  Processor : "2.2 GHZ 8-Core",
  Mobile_Application : "Yes",
  other_features : "https://olaelectric.com/",

  colors :"Coral Glam, Liquid Silver & Neo Mint",
  main_photo:"https://media.zigcdn.com/media/content/2023/Feb/cover_63da16ad3e4de.png",
  photo1:"https://www.financialexpress.com/wp-content/uploads/2022/10/Ola-S1-Air-image-gallery-1.jpg",
  photo2:"https://www.financialexpress.com/wp-content/uploads/2022/10/Untitled.png",
  company_link:"https://olaelectric.com/",
  reviews:'<iframe width="680" height="500" src="https://www.youtube.com/embed/P2GoSPH8vAo" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>'
});

const ev4=new Ev({
  vehicle_id:103,
  company: "Ather",
  vehicle: "Ather 450 X",
  price: 128000,
  Max_Power :6400 ,
  Rated_Power : 3300 ,
  Max_Torque: 26,
  Battery_capacity : 3.7,
  charge_consumption: 4,
  Battery_type : "Lithium Ion",
  No_of_Batteries : 1,
  range : 146,
  speed  : 90,
  Acceleration_0_to_60 : 7,
  Battery_charging_time :15 ,
  Fast_charging :"Yes",
  Riding_Modes : "Warp, Sport, Ride, Eco and Smart Eco",
  Transmission :"Automatic",
  Motor_type : "PMS Motor",
  Portable_Battery :"No",
  Swappable_Battery : "No",
  Charger_Type : "Portable Charger",
  Carrying_capacity  :175,
  Overall_Width : 734 ,
  Overall_Height : 1250,
  Kerb_Weight : 111.6,
  Battery_warranty : "3 Years",
  Motor_warranty : "3 Years",
  Connectivity : "Bluetooth,WiFi",
  Navigation: "Yes",
  Operating_System : "Android OS",
  Processor : "Snapdragon 212",
  Mobile_Application : "Yes",
  other_features : "https://www.atherenergy.com/",

  colors :"Cosmic Black, True Red, Salt Green, Still White, Lunar Grey, Space Grey",
  main_photo:"https://www.91-cdn.com/hub/wp-content/uploads/2023/04/Ather-450X-FI-1200x900.png",
  photo1:"https://media.zigcdn.com/media/model/2023/Jan/lest-side-view-195020530_600x400.jpg",
  photo2:"https://www.cartoq.com/wp-content/uploads/2022/07/Gen-3-Ather-450X-Electric-Scooter-Featured.jpg",
  company_link:"https://www.atherenergy.com/",
  reviews:'<iframe width="680" height="500" src="https://www.youtube.com/embed/8GhZLmXLsnw" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>'
});


const ev5=new Ev({
  vehicle_id:104,
  company: "TVS",
  vehicle: "TVS iQube",
  price: 114789,
  Max_Power :4400 ,
  Rated_Power : 3000,
  Max_Torque: 33,
  Battery_capacity : 3.04,
  charge_consumption: 3.5,
  Battery_type : "Li-ion battery pack with BMS (Battery Management System)",
  No_of_Batteries : 2,
  range : 100,
  speed  : 78,
  Acceleration_0_to_60 : 9.54,
  Battery_charging_time :5 ,
  Fast_charging :"No",
  Riding_Modes : "Eco and Power modes",
  Transmission :"Automatic",
  Motor_type : "Hub-Mounted Electric Motor",
  Portable_Battery :"No",
  Swappable_Battery : "No",
  Charger_Type : "Portable Charger",
  Carrying_capacity  :130,
  Overall_Width : 645 ,
  Overall_Height : 1140 ,
  Kerb_Weight : 117,
  Battery_warranty : "3 Years",
  Motor_warranty : "3 Years",
  Connectivity : "Bluetooth",
  Navigation: "Yes",
  Operating_System : "-",
  Processor : "-",
  Mobile_Application : "Yes",
  other_features : "https://www.tvsmotor.com/iqube?",

  colors :"Mercury Grey, Copper Bronze, Mint Blue, Lucid Yellow & Pearl White",
  main_photo:"https://gumlet.assettype.com/evoindia%2F2022-05%2Fb0a261c2-6a94-4c3f-b1f2-d9eee3a7d062%2F2.jpg?auto=format%2Ccompress&format=webp&w=400&dpr=2.6",
  photo1:"https://akm-img-a-in.tosshub.com/indiatoday/images/story/202106/5M4B0001_1200x768.jpeg?size=690:388",
  photo2:"https://www.drivespark.com/bikes-photos/modelsoverview/450x400/1009/tvsiqubedesignandstyle_1666951864.jpg/3/x.pagespeed.ic.UMX2b6JbfM.jpg",
  company_link:"https://www.tvsmotor.com/iqube?",
  reviews:'<iframe width="680" height="500" src="https://www.youtube.com/embed/e10lm6yqyMg" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>'
});

test=[ev1,ev2,ev3,ev4,ev5];


Ev.find({ company: "Ola" }).then((result) => {
  if (result.length) {
    console.log("redundant pairs detected!!!");
  } else {
    Ev.find({ company: "Ather" })
      .then((result) => {
        if (result.length) {
          console.log("redundant pairs detected!!!");
        } else {
          Ev.find({ company: "TVS" })
            .then((result) => {
              if (result.length) {
                console.log("redundant pairs detected!!!");
              } else {
                Ev.insertMany(test)
                  .then((result) => {
                    console.log("Items added successfully");
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
}).catch((err) => {
  console.log(err);
});

module.exports=Ev
