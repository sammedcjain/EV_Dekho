const mongoose = require('mongoose')
const saltRounds = 10;

mongoose.connect('mongodb+srv://sammedcjain:mongodb8762@cluster0.gldyajt.mongodb.net/adminDB',{useNewUrlParser:true});

const adminSchema=new mongoose.Schema({
  username:String,
  password:String
});
const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin
