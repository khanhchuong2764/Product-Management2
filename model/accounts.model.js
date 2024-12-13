const mongoose = require('mongoose');
const general = require("../helpers/general");
const Accountschema = new mongoose.Schema(
    {   
        fullName:String,
        email:String,
        phone:String,
        password:String,
        token: {
            type: String,
            default: general.CreateStringRamdom(20)
        },
        role_id :String,
        status:String,
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


const Account = mongoose.model('Account', Accountschema,'accounts');

module.exports = Account;