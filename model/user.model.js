const mongoose = require('mongoose');
const general = require("../helpers/general");
const Userchema = new mongoose.Schema(
    {   
        fullName:String,
        email:String,
        phone:String,
        address: String,
        password:String,
        requestFriends: Array,
        acceptFriends : Array,
        statusOnline: String,
        friendsList: [
            {
                user_id : String,
                room_chat_id : String
            }
        ],
        tokenUser: String,
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