const User = require("../../model/user.model");
const RoomChat = require("../../model/room-chat.model");
module.exports = (res) => {
    const myId = res.locals.user.id;
    _io.once('connection', (socket) => {
        socket.on("CLIENT_ADD_FRIEND", async (userId) => {
            // Luu Id nguoi muon ket ban vao requestFriend cua minh 
            const exitsIdrequestFriend = await User.findOne({
                _id : myId,
                requestFriends: userId
            })
            if (!exitsIdrequestFriend) {
                await User.updateOne({
                    _id : myId,
                },{
                    $push: {requestFriends : userId}
                })
            }

            const exitsIdAcceptFriend = await User.findOne({
                _id : userId,
                acceptFriends: myId
            })
            if (!exitsIdAcceptFriend) {
                await User.updateOne({
                    _id :userId,
                },{
                    $push: {acceptFriends : myId}
                })
            }
            // Hien thi so luong loi moi ket ban cua tai khoan dc yeu cau ket ban
            const userB = await User.findOne({_id : userId});
            const LengthAcceptFriend  = userB.acceptFriends.length;
            socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND",{
                userId : userId,
                LengthAcceptFriend:LengthAcceptFriend
            })

            socket.broadcast.emit("SERVER_RETURN_USER_REQUEST_FRIEND",{ 
                userId : userId,
                IdUserRequest : myId,
                fullNameRequest: res.locals.user.fullName,
                AvatarRequest :res.locals.user.avatar
            })
        })
        socket.on("CLIENT_CANCLE_FRIEND", async (userId) => {
            // Xóa Id của tài khoản muốn kết bạn trong requestFriend
            const exitsIdrequestFriend = await User.findOne({
                _id : myId,
                requestFriends: userId
            })
            if (exitsIdrequestFriend) {
                await User.updateOne({
                    _id : myId,
                },{
                    $pull: {requestFriends : userId}
                })
            }
             // Xóa Id của tài khoản mình khỏi AcceptFriend của tài khoản muốn kết bạn
            const exitsIdAcceptFriend = await User.findOne({
                _id : userId,
                acceptFriends: myId
            })
            if (exitsIdAcceptFriend) {
                await User.updateOne({
                    _id :userId,
                },{
                    $pull: {acceptFriends : myId}
                })
            }
            const userB = await User.findOne({_id : userId});
            const LengthAcceptFriend  = userB.acceptFriends.length;
            socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND",{
                userId : userId,
                LengthAcceptFriend:LengthAcceptFriend
            })
            socket.broadcast.emit("SERVER_RETURN_USER_ID_CANCEL_FRIEND",{ 
                userId : userId,
                IdUserCancel: myId,
            })
            
        })
        socket.on("CLIENT_REFUSE_FRIEND", async (userId) => {
            // Xóa Id của tài khoản mình khỏi requestFriend của tài khoản muốn kết bạn
            const exitsIdrequestFriend = await User.findOne({
                _id : userId,
                requestFriends: myId
            })
            if (exitsIdrequestFriend) {
                await User.updateOne({
                    _id : userId,
                },{
                    $pull: {requestFriends : myId}
                })
            }
            // Xóa Id của tài khoản muốn từ chối kết bạn khỏi acceptFriend của mình
            const exitsIdAcceptFriend = await User.findOne({
                _id : myId,
                acceptFriends: userId
            })
            if (exitsIdAcceptFriend) {
                await User.updateOne({
                    _id :myId,
                },{
                    $pull: {acceptFriends : userId}
                })
            }
            const userB = await User.findOne({_id : myId});
            const LengthAcceptFriend = userB.acceptFriends.length;
            socket.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND",{
                userId : userB.id,
                LengthAcceptFriend:LengthAcceptFriend
            })
            socket.broadcast.emit("SERVE_RETURN_DELETE_ACCEPT_FRIEND",{
                userId : myId,
                IdRequestFriend : userId
            })
        })
        socket.on("CLIENT_ACCEPT_FRIEND", async (userId) => {
            // Xóa Id của tài khoản mình khỏi requestFriend của tài khoản muốn kết bạn
            const exitsIdrequestFriend = await User.findOne({
                _id : userId,
                requestFriends: myId
            })
             // Xóa Id của tài khoản muốn từ chối kết bạn khỏi acceptFriend của mình
            const exitsIdAcceptFriend = await User.findOne({
                _id : myId,
                acceptFriends: userId
            })
            let roomChat;
            if(exitsIdAcceptFriend && exitsIdrequestFriend) {
                // Tạo Phòng Chat Chung Cho 2 Người
                const dataRoom = {
                    typeRoom: "friend",
                    users: [
                        {
                            user_id: myId,
                            role: "supperAdmin"
                        },
                        {
                            user_id: userId,
                            role: "supperAdmin"
                        }
                    ],
                }
                roomChat = new RoomChat(dataRoom);
                await roomChat.save();
                // Thêm {userId, roomChatId} của người chấp nhận kb vào friendsList của người gửi yêu cầu kb
                // Xóa id của người chấp nhận trong requestFriends của người gửi
                await User.updateOne({
                    _id : userId,
                },{
                    $pull: {requestFriends : myId},
                    $push : {friendsList: {
                        user_id : myId,
                        room_chat_id: roomChat.id
                    }}
                })
                // Thêm {userId, roomChatId} của người gửi kb vào friendsList của người chấp nhận
                // Xóa id của người gửi trong acceptFriend của người nhận
                await User.updateOne({
                    _id :myId,
                },{
                    $pull: {acceptFriends : userId},
                    $push : {friendsList: {
                        user_id : userId,
                        room_chat_id: roomChat.id
                    }}
                })
            }
            const userB = await User.findOne({_id : myId});
            const LengthAcceptFriend = userB.acceptFriends.length;
            socket.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND",{
                userId : userB.id,
                LengthAcceptFriend:LengthAcceptFriend
            })
            socket.broadcast.emit("SERVE_RETURN_DELETE_ACCEPT_FRIEND",{
                userId : myId,
                IdRequestFriend : userId
            })
        })
        socket.on("CLIENT_DELETE_FRIEND", async (userId) => {
            // Xóa Id của tài khoản mình khỏi requestFriend của tài khoản muốn kết bạn
            const exitsUserIdListFriend = await User.findOne({
                _id : myId,
                "friendsList.user_id": userId
            })
            const exitsMyIdinListFriend = await User.findOne({
                _id : userId,
                "friendsList.user_id": myId
            })
            if(exitsMyIdinListFriend && exitsUserIdListFriend) {
                await User.updateOne({
                    _id : userId,
                },{
                    $pull : {friendsList: {
                        user_id : myId,
                    }}
                })
                await User.updateOne({
                    _id :myId,
                },{
                    $pull : {friendsList: {
                        user_id : userId,
                    }}
                })

            }
            socket.broadcast.emit("SERVER_RETURN_USER_ID_CANCEL_FRIEND",{ 
                userId : userId,
                IdUserCancel: myId,
            })
        })
    });
}