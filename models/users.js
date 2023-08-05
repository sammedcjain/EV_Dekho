const mongoose = require('mongoose')
const passportLocalMongoose=require("passport-local-mongoose");
const findOrCreate = require('mongoose-findorcreate')
var conn2     = mongoose.createConnection("mongodb+srv://sammedcjain:mongodb8762@cluster0.gldyajt.mongodb.net/usersDB",{useNewUrlParser:true});

const userSchema=new mongoose.Schema({
  username:String,
  password:String,
  googleId:String,
  data:Array
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);
userSchema.plugin(passportLocalMongoose, {
  errorMessages: {
    IncorrectUsernameError: 'Username not found',
    UserExistsError: 'Username not found',
    IncorrectPasswordError: 'Incorrect password'
  }
});
// const User = mongoose.model('User', userSchema);
var User = conn2.model('User',userSchema );

module.exports = User
