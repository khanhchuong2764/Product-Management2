const uploadCloudianry = require("../../helpers/uploadCloudinaryHelper");
const Chat = require("../../model/chat.model");
module.exports = (res) => {
    _io.once('connection', (socket) => {
        socket.on('CLIENT_SEND_MESSAGE', async (data) => {
            let imagesArr = [];
            for (const image of data.images) {
                const link = await uploadCloudianry(image);
                imagesArr.push(link);
            }
            // Lưu vào database
            const chat = new Chat({
                user_id: res.locals.user.id,
                content:data.content,
                images : imagesArr
            })
            await chat.save();
    
            // Phản hồi Client hiển thị message realtime
            _io.emit("SERVER_RETURN_MESSAGE",{
                chatId : chat.id,
                user_id : res.locals.user.id,
                fullName: res.locals.user.fullName,
                content:data.content,
                images:imagesArr
            });
          });
        socket.on('CLIENT_SEND_TYPING', async (type) => {
            socket.broadcast.emit("SERVER_RETURN_TYPING",{
                user_id:res.locals.user.id,
                fullName:res.locals.user.fullName,
                type:type
            })
        });
        socket.on('CLIENT_SEND_DELETE_MESSAGE', async (data) => {
            if (data.user_id == res.locals.user.id ) {
                await Chat.deleteOne({_id : data.chatId});
                _io.emit("SERVER_RETURN_MESSAGE_DELETE",data.chatId);
            }else {
                return;
            }
        });
    });
}