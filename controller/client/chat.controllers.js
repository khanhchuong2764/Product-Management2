const Chat = require("../../model/chat.model");
const User = require("../../model/user.model");
const uploadCloudianry = require("../../helpers/uploadCloudinaryHelper");
const ChatSocket = require("../../socket/client/chat.socket");
const RoomChat = require("../../model/room-chat.model");
module.exports.index = async(req,res ) => {
    ChatSocket(req,res);
    const roomChatId = req.params.roomchatId;
    // Lấy thông tin phòng chat
    const roomChat = await RoomChat.findOne({_id:roomChatId ,deleted:false});
    // Lấy Thông Tin Đoạn Chat In Ra Giao Diện
    const chats = await Chat.find({
        deleted:false,
        room_chat_id :roomChatId 
    })
    for (const chat of chats) {
        const fullNameChat = await User.findOne({_id :chat.user_id}).select("fullName");
        chat.inforUser = fullNameChat;
    }
    let OjectChat = {
        title: "",
        rom_chat_id : roomChatId
    };
    if(roomChat.title) {
        OjectChat.title= roomChat.title;
    }else {
        for (const user of roomChat.users) {
            if(user.user_id != res.locals.user.id) {
                const infor = await User.findOne({_id :user.user_id}).select("fullName");
                OjectChat.title=infor.fullName;
            }
        }
    }
    res.render("client/pages/chat/index",{
        titlePage: "Chat",
        chats :chats,
        OjectChat:OjectChat
    })
}