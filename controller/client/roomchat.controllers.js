const User = require("../../model/user.model");
const RoomChat = require("../../model/room-chat.model");
// [GET] /rooms-chat
module.exports.index = async (req, res) => {
    const roomschat = await RoomChat.find({
        "users.user_id" : res.locals.user.id,
        typeRoom:"group",
        deleted:false
    }).select("title id");
    res.render("client/pages/rooms-chat/index",{
        titlePage:"Danh Sách Phòng Chat",
        roomschat:roomschat
    })
}

// [GET] /rooms-chat/create
module.exports.create = async (req, res) => {
    const friendList = res.locals.user.friendsList;
    for (const friend of friendList) {
        const infor = await User.findOne({_id :friend.user_id , deleted :false ,status:"active"}).select("fullName avatar");
        friend.infor = infor;
    }
    res.render("client/pages/rooms-chat/create",{
        titlePage:"Tạo Phòng Chat",
        friendList:friendList
    })
}

// [POST] /rooms-chat/createPost
module.exports.createPost = async (req, res) => {
    const title = req.body.title;
    const UsersIDjoinRoomChat = req.body.usersId;
    const dataRoom = {
        title: title,
        typeRoom: "group",
        users: [],
    };
    dataRoom.users.push({
        user_id : res.locals.user.id,
        role: "supperAdmin"
    })
    if(typeof(UsersIDjoinRoomChat)=="string") {
        dataRoom.users.push({
            user_id : UsersIDjoinRoomChat,
            role: "user"
        })
    }else {
        for (const userId of UsersIDjoinRoomChat) {
            dataRoom.users.push({
                user_id : userId,
                role: "user"
            })
        }
    }
    const roomchat = new RoomChat(dataRoom);
    await roomchat.save();
    res.redirect(`/chat/${roomchat.id}`);
}


// [GET] /rooms-chat/adduser/:roomchatId
module.exports.addUser = async (req, res) => {
    const RoomChatId = req.params.roomchatId;
    const roomChat = await RoomChat.findOne({_id : RoomChatId,deleted:false,typeRoom:"group"});
    const UserIdinRoomChat = roomChat.users.map(item => item.user_id);
    const friendList = res.locals.user.friendsList;
    const friendListId = friendList.map(item => item.user_id);
    const users = await User.find({
        $and : [
            {_id : {$nin : UserIdinRoomChat}},
            {_id : {$in : friendListId}},
        ],
        deleted:false,
        status:"active"
    }).select("fullName id avatar");
    res.render("client/pages/rooms-chat/adduser",{
        titlePage:"Thêm Thành Viên",
        friendList:users,
        RoomChatId:RoomChatId
    })
}


// [PATCH] /rooms-chat/adduser/:roomchatId
module.exports.addUserPatch = async (req, res) => {
    let RoomChatId;
    try {
        RoomChatId = req.params.roomchatId;
        const UsersIdaddRoomChat = req.body.usersId;
        if(typeof(UsersIdaddRoomChat) == "string") { 
            await RoomChat.updateOne({
                _id : RoomChatId
            }, {
                $push: {users: {
                    user_id : UsersIdaddRoomChat,
                    role : "user"
                }}
            })
        }else {
            for (const userId of UsersIdaddRoomChat) {
                await RoomChat.updateOne({
                    _id : RoomChatId
                }, {
                    $push: {users: {
                        user_id : userId,
                        role : "user"
                    }}
                })
            }
        }
    } catch (error) {
        res.redirect("/");
    }
    res.redirect(`/chat/${RoomChatId}`);
}


// [GET] /rooms-chat/user/:roomchatId
module.exports.User = async (req, res) => {
    const IdRoomChat = req.params.roomchatId;
    const roomchat = await RoomChat.findOne({_id : IdRoomChat,deleted:false,typeRoom:"group"});
    for (const user of roomchat.users) {
        const infor = await User.findOne({_id : user.user_id}).select("fullName avatar");
        user.infor = infor;
    }
    res.render("client/pages/rooms-chat/user",{
        titlePage:"Danh Sách Thành Viên",
        users:roomchat.users
    })
}
