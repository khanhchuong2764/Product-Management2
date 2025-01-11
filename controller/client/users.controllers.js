const User = require("../../model/user.model");
const UserSocket = require("../../socket/client/users.socket");
// [GET] /users/not-friend
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

// [GET] /users/request
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

// [GET] /users/accept
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

// [GET] /users/friends
module.exports.friends = async (req,res) => {
    UserSocket(res);
    const FriendList = res.locals.user.friendsList;
    const users=[];
    for (const user of FriendList) {
        const inforUser = await User.findOne({
            _id : user.user_id ,
            deleted:false,
            status:"active"
        })
        users.push({
            id: inforUser.id,
            fullName: inforUser.fullName,
            avatar: inforUser.avatar,
            statusOnline: inforUser.statusOnline,
            roomChatId: user.room_chat_id
        })
    }
    res.render("client/pages/user/friends",{
        titlePage:"Danh Sách Bạn Bè",
        users:users
    })
}
