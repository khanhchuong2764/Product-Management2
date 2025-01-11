const Chat = require("../../model/chat.model");
const User = require("../../model/user.model");
const uploadCloudianry = require("../../helpers/uploadCloudinaryHelper");
const ChatSocket = require("../../socket/client/chat.socket");
module.exports.index = async(req,res ) => {
    ChatSocket(req,res);
    const roomChatId = req.params.roomchatId;
    // Lấy Thông Tin Đoạn Chat In Ra Giao Diện
    const chats = await Chat.find({
        deleted:false,
        room_chat_id :roomChatId 
    })
    for (const chat of chats) {
        const fullNameChat = await User.findOne({_id :chat.user_id}).select("fullName");
        chat.inforUser = fullNameChat;
    }
    res.render("client/pages/chat/index",{
        titlePage: "Chat",
        chats :chats
    })
}