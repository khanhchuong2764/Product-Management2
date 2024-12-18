const mongoose = require('mongoose');
const general = require("../helpers/general");
const Userchema = new mongoose.Schema(
    {   
        fullName:String,
        email:String,
        phone:String,
        address: String,
        password:String,
        tokenUser: {
            type: String,
            default: general.CreateStringRamdom(20)
        },
        status:{
            type:String,
            default: "active"
        },
        avatar:String,
        deleted:{
            type:Boolean,
            default: false
        },
        deleteAt: Date
    }, {
        timestamps: true
    }
);


const User = mongoose.model('User', Userchema,'users');

module.exports = User;