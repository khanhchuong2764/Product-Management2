const User = require("../../model/user.model");
const RoomChat = require("../../model/room-chat.model");
module.exports.isAccess = async (req,res,next) => {
    try {
        const exitsUserInRoomChat = await RoomChat.findOne({
            _id : req.params.roomchatId,
            "users.user_id" : res.locals.user.id
        })
        if(exitsUserInRoomChat) {
            next();
        }else {
            res.redirect("/");
            return;
        }
    } catch (error) {
        res.redirect("/");
        return; 
    }
}

module.exports.roleaddUser = async (req,res,next) => {
    try {
        const exitsUserInRoomChat = await RoomChat.findOne({
            _id : req.params.roomchatId,
            "users.user_id" : res.locals.user.id
        })  
        if(exitsUserInRoomChat) {
            const user = exitsUserInRoomChat.users.find(item => item.user_id == res.locals.user.id);
                if(user.role =="supperAdmin" ||user.role == "admin") {
                    next();
                }else {
                    req.flash("error","Bạn Không Có Quyền Thêm Thành Viên");
                    res.redirect(`/chat/${req.params.roomchatId}`);
                }
        }else {
            req.flash("error","Không Có Quyền Truy Cập");
            res.redirect("/rooms-chat");
            return;
        }
    } catch (error) {
        req.flash("error","Không Tìm Thấy Phòng Chat");
        res.redirect("/");
        return; 
    }
}