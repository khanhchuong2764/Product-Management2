const mongoose = require('mongoose');
const RoomChatschema = new mongoose.Schema(
    {   
        title:String,
        // avatar: String,
        // background: String,
        typeRoom: String,
        status: String,
        users: [
            {
                user_id: String,
                role: String
            }
        ],
        deleted:{
            type:Boolean,
            default: false
        },
        deleteAt: Date  
    }, {
        timestamps: true
    }
);


const RoomChat = mongoose.model('RoomChat', RoomChatschema,'rooms-chat');

module.exports = RoomChat;