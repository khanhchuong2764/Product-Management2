const User = require("../../model/user.model");
const md5 = require("md5");
// [GET] /user/register
module.exports.register = (req,res) => {
    res.render("client/pages/users/register",{
        titlePage : "Đăng Ký Tài Khoản"
    })
}

// [POST] /user/register
module.exports.registerPost = async (req,res) => {
    const existEmail = await User.findOne({email: req.body.email,deleted:false});
    if (existEmail){
        req.flash("error","Email đã tồn tại");
        res.redirect("back");
        return;
    }
    req.body.password = md5(req.body.password);
    const user = new User(req.body);
    await user.save();
    res.cookie("tokenUser",user.tokenUser);  
    res.redirect("/");
}

// [GET] /user/login
module.exports.login = (req,res) => {
    res.render("client/pages/users/login",{
        titlePage : "Đăng Nhập Tài Khoản"
    })
}

// [POST] /user/login
module.exports.loginPost = async (req,res) => {
    const existEmail = await User.findOne({email: req.body.email, deleted: false});
    if(!existEmail){
        req.flash("error","Email Không rồn tại");
        res.redirect("back");
        return;
    }
    if (existEmail.password != md5(req.body.password)){
        req.flash("error","Sai Mật Khẩu");
        res.redirect("back");
        return;
    }
    if (existEmail.status == "inactive"){
        req.flash("error","Tài khoản đã bị khóa");
        res.redirect("back");
        return;
    }
    res.cookie("tokenUser",existEmail.tokenUser);
    req.flash("success","Đăng Nhập Tài Khoản Thành Công");
    res.redirect("/");
}


// [GET] /user/logout
module.exports.logout = (req,res) => {
    res.clearCookie("tokenUser");
    res.redirect("/");
}