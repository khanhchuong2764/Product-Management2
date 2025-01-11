const mongoose = require('mongoose');
const Chatschema = new mongoose.Schema(
    {   
        user_id:String,
        room_chat_id : String,
        content:String,
        images:Array,
        deleted:{
            type:Boolean,
            default: false
        },
        deleteAt: Date  
    }, {
        timestamps: true
    }
);


const Chat = mongoose.model('Chat', Chatschema,'chats');

module.exports = Chat;