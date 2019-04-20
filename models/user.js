var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    lastname:String,
    email:String,
    phonenuber:String,
    sex:String,
    school:String,
    childname:String,
    childage: String ,
    address :String,
    prof: String

});

UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", UserSchema);