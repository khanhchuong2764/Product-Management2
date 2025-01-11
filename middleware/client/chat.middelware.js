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