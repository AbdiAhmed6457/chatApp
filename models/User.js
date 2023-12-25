const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        min:3,
        max:20,
        unique:true
    }, 
    email: {
        type: String,
        required: true,
        max: 50,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 6
    },
    profilepicture:{
        type: String,
        default: ""
    },
    coverpicture:{
        type: String,
        default: ""
    },
    followers: {
        type: Array,
        default: []
    },
    following: {
        type: Array,
        default: []
    },
    isAdmin:{
        type: Boolean,
        default: false
    },
    desc:{
        type: String,
        max:50
    },
    city: {
        type:String,
        max:50
    },
    relationship: {
        type: String,
        enum: [1,2,3,4]
    }

},
{timestamps: true}

);

module.exports = mongoose.model("User", UserSchema)