const passportLocalMongoose = require("passport-local-mongoose");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var User = new Schema({
    firstname: {
        type: String,
        default: ""
    },
    lastname: {
        type: String,
        default: ""
    },
    admin:   {
        type: Boolean,
        default: false
    },
    favorite: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Favorites"
    },
    facebookId: String,
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", User);