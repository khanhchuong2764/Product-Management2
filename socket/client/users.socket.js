const User = require("../../model/user.model");
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
        })
    });
}