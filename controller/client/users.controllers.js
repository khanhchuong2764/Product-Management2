const User = require("../../model/user.model");
const UserSocket = require("../../socket/client/users.socket");
module.exports.notFriend = async (req,res) => {
    const myId = res.locals.user.id;
    UserSocket(res);
    const requestFriendId = res.locals.user.requestFriends; 
    const AcceptFriendId = res.locals.user.acceptFriends; 
    const FriendList = res.locals.user.friendsList;
    const friendListId = FriendList.map(item => item.user_id);
    const users = await User.find({
        // _id : {$nin : [myId, ...requestFriendId]},
        $and : [
            {_id : {$ne : myId}},
            {_id : {$nin : requestFriendId}},
            {_id : {$nin : AcceptFriendId}},
            {_id : {$nin : friendListId}}
        ],
        deleted:false,
        status:"active"
    }).select("fullName id avatar");
    res.render("client/pages/user/not-friend",{
        titlePage:"Danh Sách Bạn Bè",
        users:users
    })
}


module.exports.request = async (req,res) => {
    UserSocket(res);
    const IdRequestFriend = res.locals.user.requestFriends;
    const users = await User.find({
        _id : {$in :IdRequestFriend },
        deleted :false,
        status : "active"
    }).select("fullName id avatar");
    res.render("client/pages/user/request",{
        titlePage:"Lời Mời Đã Gửi",
        users:users
    })
}


module.exports.accept = async (req,res) => {
    UserSocket(res);
    const IdAcceptFriend = res.locals.user.acceptFriends;
    const users = await User.find({
        _id : {$in :IdAcceptFriend },
        deleted :false,
        status : "active"
    }).select("fullName id avatar");
    res.render("client/pages/user/accept",{
        titlePage:"Lời Mời Kết Bạn",
        users:users
    })
}