const SystemConfig = require("../../config/system");
const Account = require("../../model/accounts.model");
const Role = require("../../model/roles.model");

module.exports.requireAuth = async (req,res,next) => {
    const token = req.cookies.token;
    if(!token) {
        res.redirect(`${SystemConfig.PrefixAdmin}/auth/login`);
    }else {
        const user = await Account.findOne({token : token}).select("-password");
        if (!user) {
            res.redirect(`${SystemConfig.PrefixAdmin}/auth/login`);
        }else {
            const role = await Role.findOne({_id : user.role_id}).select("title permission");
            res.locals.user = user;  
            res.locals.role = role;   
            next();
        }
    }
}