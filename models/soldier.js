var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    name: String,
    status:String

});

UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("Soldier", UserSchema);