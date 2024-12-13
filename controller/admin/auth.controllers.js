const Account = require("../../model/accounts.model");
const md5 = require('md5');
const SystemConfig = require("../../config/system");
// [GET] /admin/auth/login
module.exports.login = async (req, res) => {
    if(req.cookies.token) {
        const user = await Account.findOne({token : req.cookies.token});
        if(user) {
            res.redirect(`${SystemConfig.PrefixAdmin}/dashboard`);
        }else {
            res.render("admin/pages/auth/login",{
                titlePage:"Trang Đăng Nhập"
            }) 
        }
    }else {
        res.render("admin/pages/auth/login",{
            titlePage:"Trang Đăng Nhập"
        })  
    } 
}


// [POST] /admin/auth/login
module.exports.loginPost = async (req, res) => {
    const email=req.body.email;
    const password=req.body.password;
    const user = await Account.findOne({email : email , deleted :false});
    if (!user) {
        req.flash("error", `Email không tồn tại`);
        res.redirect("back");
        return;
    }
    if (user.password != md5(password)){
        req.flash("error", `Sai mật khẩu`);
        res.redirect("back");
        return;
    }
    if (user.status == "inactive"){
        req.flash("error", `Tài khoản bị khóa`);
        res.redirect("back");
        return;
    }
    res.cookie('token',user.token);
    res.redirect(`${SystemConfig.PrefixAdmin}/dashboard`);
}

// [GET] /admin/auth/logout
module.exports.logout = (req, res) => {
    res.clearCookie('token');
    res.redirect(`${SystemConfig.PrefixAdmin}/auth/login`);
}