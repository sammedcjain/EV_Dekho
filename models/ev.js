const mongoose = require('mongoose')

var conn      = mongoose.createConnection("mongodb+srv://sammedcjain:mongodb8762@cluster0.gldyajt.mongodb.net/evolvedb",{useNewUrlParser:true});
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

module.exports = Ev
