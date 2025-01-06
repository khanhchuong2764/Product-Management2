const Chat = require("../../model/chat.model");
const User = require("../../model/user.model");
module.exports.index = async(req,res ) => {
    _io.once('connection', (socket) => {
        socket.on('CLIENT_SEND_MESSAGE', async (content) => {
            // Lưu vào database
            const chat = new Chat({
                user_id: res.locals.user.id,
                content:content,
            })
            await chat.save();

            // Phản hồi Client hiển thị message realtime
            _io.emit("SERVER_RETURN_MESSAGE",{
                user_id : res.locals.user.id,
                fullName: res.locals.user.fullName,
                content:content
            });
          });
        socket.on('CLIENT_SEND_TYPING', async (type) => {
            socket.broadcast.emit("SERVER_RETURN_TYPING",{
                user_id:res.locals.user.id,
                fullName:res.locals.user.fullName,
                type:type
            })
        });
    });
    // Lấy Thông Tin Đoạn Chat In Ra Giao Diện
    const chats = await Chat.find({
        deleted:false
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