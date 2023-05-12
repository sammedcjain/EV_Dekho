require('dotenv').config()
const https=require("https");
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session=require("express-session");
const passport=require("passport");
const passportLocalMongoose=require("passport-local-mongoose");
const findOrCreate = require('mongoose-findorcreate')
const app = express();
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require("bcrypt");

fs = require('fs'),
url = require('url');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');

//authentication ==
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  // cookie: { secure: true }
}))

app.use(passport.initialize());
app.use(passport.session());

// mongoose.connect("mongodb+srv://sammedcjain:mongodb8762@cluster0.gldyajt.mongodb.net/evolvedb",{useNewUrlParser:true});

// mongoose.connect("mongodb://127.0.0.1:27017/evolvedb",{useNewUrlParser:true});
// mongoose.connect("mongodb://127.0.0.1:27017/usersDB",{useNewUrlParser:true});
var conn      = mongoose.createConnection("mongodb+srv://sammedcjain:mongodb8762@cluster0.gldyajt.mongodb.net/evolvedb",{useNewUrlParser:true});
var conn2     = mongoose.createConnection("mongodb+srv://sammedcjain:mongodb8762@cluster0.gldyajt.mongodb.net/usersDB",{useNewUrlParser:true});

// stored in 'testA' database
const evSchema = new mongoose.Schema({
  vehicle_id: {type:Number,required: true,unique: true},
  company: String,
  vehicle: String,
  price: Number,
Max_Power :Number,
Rated_Power : Number,
Max_Torque: Number,
Battery_capacity : Number,
charge_consumption: Number,
Battery_type : String,
No_of_Batteries : Number,
range : Number,
speed  : Number,
Acceleration_0_to_60 : Number,
Battery_charging_time :Number,
Fast_charging :String,
Riding_Modes : String,
Transmission :String,
Motor_type : String,
Portable_Battery :String,
Swappable_Battery : String,
Charger_Type : String,
Carrying_capacity  :Number,

Overall_Width : Number,
Overall_Height : Number,
Kerb_Weight : Number,

Battery_warranty : String,
Motor_warranty : String,

Connectivity : String,
Navigation: String,
Operating_System : String,
Processor : String,
Mobile_Application : String,
other_features : String,

colors :String ,

main_photo:{type:String,default:"https://www.evarena.org/webp/top-5-affordable-electric-cars-for-uk1fc214004c9481e4c8073e85323bfd4b.webp"},
photo1:{type:String,default:"https://www.evarena.org/webp/top-5-affordable-electric-cars-for-uk1fc214004c9481e4c8073e85323bfd4b.webp"},
photo2:{type:String,default:"https://www.evarena.org/webp/top-5-affordable-electric-cars-for-uk1fc214004c9481e4c8073e85323bfd4b.webp"},
company_link:String,
reviews:String
});

var Ev    = conn.model('Ev',evSchema);

// stored in 'testB' database
const userSchema=new mongoose.Schema({
  username:String,
  password:String,
  googleId:String,
  data:Array
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

// const User = mongoose.model('User', userSchema);
var User = conn2.model('User',userSchema );
passport.use(User.createStrategy());
passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, {
      id: user.id,
      username: user.username,
      picture: user.picture
    });
  });
});

passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/evdb",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile._json.name);
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

app.get("/login",function(req,res){
  res.render("login");
});

app.get("/register",function(req,res){
  res.render("register");
});

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/evdb',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect secrets.
    res.redirect('/evdb');
  });

  app.get("/evdb", function(req, res) {
    var total_users ;

    User.countDocuments().then((count)=>{total_users=count;}).catch((err)=>{console.log(err);});

  if (req.isAuthenticated()) {
    User.findById(req.user.id)
      .then((user) => {
        if (user) {
          var data = user.data;
          var vehicles = [];

          var promises = data.map((vehicle) => {
            return Ev.find({ vehicle: vehicle })
              .then((result) => {
                console.log(result);
                if (result.length > 0) {
                  vehicles.push(result);
                }else {
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
              res.render("home", { recent_vehicles: data, vehicle_data: sortedData,user_count:total_users });
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


  app.get("/logout", function(req, res){
    req.logout(function(err) {
      if (err) { return next(err); }
    res.redirect("/");
  })
  });

  app.get("/submit",function(req,res){
    if (req.isAuthenticated()){
      res.render("submit");
    } else {
      res.redirect("/login");
    }
  });

  app.post("/register",function(req,res){
    User.register({username: req.body.username}, req.body.password, function(err, user){
      if (err) {
        console.log(err);
        res.redirect("/register");
      } else {

        passport.authenticate("local")(req, res, function(){
          res.redirect("/evdb");
        });
      }
    });
  });


  app.post("/login",function(req,res){

    const user = new User({
     username: req.body.username,
     password: req.body.password
   });

   req.login(user, function(err){
     if (err) {
       console.log(err);
     } else {
       passport.authenticate("local")(req, res, function(){
          res.redirect("/evdb");
        });
      }
    });
  });

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



app.get("/", function(req, res){
  res.sendFile(__dirname+"/landing.html");
});


app.get("/requirements",function(req,res){

  if (req.isAuthenticated()){
      res.sendFile(__dirname+"/index.html");
    } else {
      res.redirect("/login");
    }

});

app.post("/authentication",function(req,res){
  res.redirect("/authentication");
  console.log("Admin access requested");

})

app.post("/admin",function(req,res){
  if(req.body.username=="sam" && req.body.pass==12345){
   console.log("Authetication successful");
   res.redirect("/kookaburra");
 }else{
   console.log("Authetication failed");
   res.redirect("/fail");
 }
})

app.post("/data",function(req,res){
  var comp= req.body.company;
  var pri = req.body.price;
  //console.log(req.params.username);
  if(pri!="any")
  {pri=pri*1000;}
  else if (pri=="any") {
    pri=10000000
  }
  var ran = req.body.range;
  if(ran=="any"){ran=0}
  var spd = req.body.speed;
  if(spd=="any"){spd=0}
  //console.log(comp,pri,ran,spd);

  if(req.body.showall=='showall'){
    Ev.find().then(
      (result) => {
        var data=[];
         result.forEach(function(each){
            //console.log(each);
            data.push(each);
         })
         res.render("dbtable", {evdb:data});
      }
    ).catch(
      (err) => {
         console.log(err);
      })
  }
  else if(comp=='any')
  {
    Ev.find({price:{$lte:pri},range:{$gte:ran},speed:{$gte:spd}}).then(
      (result) => {
        var data=[];
         result.forEach(function(each){
            //console.log(each);
            data.push(each);
         })
         res.render("dbtable", {evdb:data});
      }
    ).catch(
      (err) => {
         console.log(err);
      })
  }
  else if(pri!=126000){

  Ev.find({company:comp,price:{$lte:pri},range:{$gte:ran},speed:{$gte:spd}}).then(
    (result) => {
      var data=[];
       result.forEach(function(each){
          //console.log(each);
          data.push(each);
       })
       res.render("dbtable", {evdb:data});
    }
  ).catch(
    (err) => {
       console.log(err);
    })
  }else{
    Ev.find({company:comp,price:{$gte:pri},range:{$gte:ran},speed:{$gte:spd}}).then(
      (result) => {
        var data=[];
         result.forEach(function(each){
            //console.log(each);
            data.push(each);
         })
         res.render("dbtable", {evdb:data});
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

    req.on('end', function (){
        fs.appendFile(filePath, body, function() {
            res.end();
        });
    });
});

app.post("/dbupdate",function(req,res){
  const v_id=req.body.vehicle_id;
  const comp_up=req.body.company;
  const vehi_up=req.body.vehicle;


var evs=new Ev({
vehicle_id:req.body.vehicle_id,
company: req.body.company,
vehicle: req.body.vehicle,
price: req.body.price,
Max_Power: req.body.Max_Power,
Rated_Power: req.body.Rated_Power,
Max_Torque: req.body.Max_Torque,
Battery_capacity: req.body.Battery_capacity,
charge_consumption: req.body.charge_consumption,
Battery_type: req.body.Battery_type,
No_of_Batteries: req.body.No_of_Batteries,
range: req.body.range,
speed: req.body.speed,
Acceleration_0_to_60: req.body.Acceleration_0_to_60,
Battery_charging_time: req.body.Battery_charging_time,
Fast_charging: req.body.Fast_charging,
Riding_Modes: req.body.Riding_Modes,
Transmission: req.body.Transmission,
Motor_type: req.body.Motor_type,
Portable_Battery: req.body.Portable_Battery,
Swappable_Battery: req.body.Swappable_Battery,
Charger_Type: req.body.Charger_Type,
Carrying_capacity: req.body.Carrying_capacity,
Overall_Width: req.body.Overall_Width,
Overall_Height: req.body.Overall_Height,
Kerb_Weight: req.body.Kerb_Weight,
Battery_warranty: req.body.Battery_warranty,
Motor_warranty: req.body.Motor_warranty,
Connectivity: req.body.Connectivity,
Navigation: req.body.Navigation,
Operating_System: req.body.Operating_System,
Processor: req.body.Processor,
Mobile_Application: req.body.Mobile_Application,
other_features: req.body.other_features,
colors: req.body.colors,
main_photo:req.body.main_photo,
photo1:req.body.photo1,
photo2:req.body.photo2,
company_link:req.body.company_link,
reviews:req.body.reviews
  });
  //console.log(Ev.find({company:comp_up,vehicle:vehi_up}));
  Ev.find({company:comp_up,vehicle:vehi_up}).then(
    (result) => {
       if(result.length){
         console.log("Db already exists ! cannot add redundant pairs");
         res.send("<h1>Redundant pairs detected !!!</h1>");
       }else{
         Ev.insertMany(evs).then(
         (result) => {
         console.log("Items added succesfully");
         res.send("<h1>Items added succesfully</h1>");
       }
  ).catch(
    (err) => {
       console.log(err);
    }
  )
       }
    }
  ).catch(
    (err) => {
       console.log(err);
    }
  )
});

app.post("/db_update",function(req,res){
  var key_vehicle = req.body.vehicle;
  //console.log(key_vehicle);
  var to_update = req.body.to_update;
  //console.log(to_update);
  var to_update_data = req.body.update_data;
  //console.log(to_update_data);
  Ev.updateOne({vehicle:key_vehicle},{$set:{[to_update]:to_update_data}}).then(
    (result)=>{
      //console.log(result);
      if(result.modifiedCount > 0){
        console.log("Db updated successfully");
        res.send("<h1>DB updated successfully</h1>");
      }else{
        console.log("Could not update the data");
        res.send("<h1>Could not update the data ...</h1><h2> go back & please try again !!!</h2>");
      }
    }
  ).catch((err)=>{console.log(err);})
});

app.post("/dbdelete",function(req,res){
  var item=1;
  const veh_del = req.body.vehicle_del;
  Ev.find({vehicle:veh_del}).then(
    (resu)=>{
      if(resu.length){
      console.log("Deletion in progress");
    }else{
      console.log("Item not found !!");
      res.send("<h1>Item not found !!!</h1>");
      item=0;
    }
    }
  ).catch(
    (err) => {
       console.log(err);
    }
  )

  Ev.deleteOne({ vehicle:veh_del }).then(
    (result) => {
       Ev.find({vehicle:veh_del}).then(
         (results) => {
           if(results.length){
            console.log("Could'nt find your specified item!");
            res.send("<h1>Could'nt find your specified item!!!</h1>");
          }else{
            if(item!=0){
            console.log(veh_del+ " Deleted successfully !");
            res.send("<h1> Deleted successfully </h1>");
          }
          }
         }
       ).catch(
         (err) => {
            console.log(err);
         }
       )

    }
  ).catch(
    (err) => {
       console.log(err);
    }
  )

})

app.get("/calculator",function(req,res){
  if (req.isAuthenticated()){
      res.sendFile(__dirname+"/cal.html");
    } else {
      res.redirect("/login");
    }

});

app.post("/calculatorres",function(req,res){
  var distance=req.body.distance;
  var milage=req.body.milage;
  var petrol=req.body.petrol;
  var service=req.body.service;
  var charges=req.body.charges;
  var key=req.body.key;
  var vehicle=req.body.vehicle_type;
  //console.log(vehicle);
  if(key==1){
    var consumption=req.body.consumption;
    var range = req.body.range;
  }else{
    var consumption =3 ;
    var range =100 ;
  }


  // for petrol
  let kms=distance*365;

  let ltrs=kms/milage;

  let petrol_total = petrol*ltrs;

  let petrol_Total=parseFloat(petrol_total)+parseFloat(service);

  // for ev
  // cost per charge
  let cpc = consumption*charges;
  let total_num_charges = kms / range;
  let cpy = total_num_charges * cpc;

  let final=petrol_Total-cpy;

  if(vehicle=="Diesel"){
    var fcarbon=2.68*ltrs;
  }else if (vehicle=="Petrol") {
    var fcarbon=2.31*ltrs;
  }

  let total_consumption_year=consumption*total_num_charges;
  var ecarbon=0.684*total_consumption_year;
  var carbon = fcarbon-ecarbon;
  var evdb_specific = {
    petrol_Total: petrol_Total,
    cpy: cpy,
    total:final,
    fcarbon:fcarbon,
    ecarbon:ecarbon,
    carbon:carbon,
    vehicle:vehicle
  };
  res.render("cal", {evcal:evdb_specific});

});


app.route("/vehicle_info/:vehicle")

  .get(function(req,res){
    if (req.isAuthenticated()){
      const user = req.user;
      //console.log(user,req.params.vehicle);

      User.updateOne(
        { _id: req.user.id },
        { $addToSet: { data: req.params.vehicle } }
      )
        .then(() => {
          return User.updateOne(
            { _id: req.user.id },
            { $push: { data: { $each: [], $slice: -3 } } }
          );
        })
        .then((result) => {
          //console.log(result);
        })
        .catch((err) => {
          console.log(err);
        });

      Ev.find({vehicle:req.params.vehicle}).then(
        (result) => {
          //console.log(result);
          var vehicle_info=[];
           result.forEach(function(each){
              vehicle_info.push(each);
           })
           res.render("vehicle_info", {ev_info:vehicle_info});
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

app.get("/compare",function(req,res){
  Ev.find({}, { vehicle: 1, _id: 0 }).then(
    (result) => {
      var ev_names=[];
       result.forEach(function(each){
          ev_names.push(each);
       })
       res.render("comparision",{EV_names:ev_names});
    }
  ).catch(
    (err)=> {console.log(err);}
  )

});

app.post("/compare/:vehicle1/:vehicle2/:vehicle3?", function(req, res){
  let vehicle1 = req.params.vehicle1;
  let vehicle2 = req.params.vehicle2;
  let vehicle3 = req.params.vehicle3;

  let vehicles = [vehicle1, vehicle2];

  if (vehicle3) {
    vehicles.push(vehicle3);
  }
  var length=vehicles.length;
  if(length==2){
  Ev.find({ vehicle: { $in: [vehicle1,vehicle2] }}).then(
    (result)=>{
     res.render("vehicle_comparision",{vehicle_data:result});
    }
  ).catch(
    (err)=>{console.log(err);}
  )
}else if (length==3) {
  Ev.find({ vehicle: { $in: [vehicle1,vehicle2,vehicle3] }}).then(
    (result)=>{
      res.render("vehicle_comparision",{vehicle_data:result});
    }
  ).catch(
    (err)=>{console.log(err);}
  )
}

});

//admin bcrypt=

const saltRounds = 10;

mongoose.connect('mongodb+srv://sammedcjain:mongodb8762@cluster0.gldyajt.mongodb.net/adminDB',{useNewUrlParser:true});

const adminSchema=new mongoose.Schema({
  username:String,
  password:String
});
const Admin = mongoose.model('Admin', adminSchema);

app.get("/admin_registeration_Tony_De_Cost_Invite",function(req,res){
  res.sendFile(__dirname+"/admin_registeration.html");
});

app.get("/authentication",function(req,res){
  res.sendFile(__dirname+"/admin_authentication.html");
});

app.get("/fail",function(req,res){
  res.sendFile(__dirname+"/auth_failed.html");
});

// app.get("/kookaburra",function(req,res){
//   res.sendFile(__dirname+"/admin.html");
// });

app.post("/admin_register",function(req,res){

  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    var user=req.body.username;
    var pass=hash;
    //console.log(pass);
    const newAdmin= new Admin({
      username:user,
      password:pass
    });
    newAdmin.save().then(
      (result) => {
         console.log("admins added succesfully");
         res.sendFile(__dirname+"/admin.html");
      }
    ).catch(
      (err) => {
         console.log(err);
      }
    )
});


});

app.post("/admin_login",function(req,res){
  var user=req.body.username;
  var pass=req.body.password;

  Admin.findOne({username:user}).then(
  (result) => {
     console.log("login credentials found");
     //console.log("results ="+result);
     bcrypt.compare(pass, result.password, function(err, presult) {
       if(presult==true){
         res.sendFile(__dirname+"/admin.html");
       }
       else{
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

//logout =
app.get("/logout", function(req, res){
  req.logout(function(err) {
    if (err) { return next(err); }
  res.redirect("/login");
})
});

let port = process.env.PORT;
if(port==null || port ==""){
  port=3000;
}

app.listen(port, function() {
  console.log("Server has started successfully");
});
