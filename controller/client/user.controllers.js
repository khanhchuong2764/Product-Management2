const User = require("../../model/user.model");
const md5 = require("md5");
const general = require("../../helpers/general");
const ForgotPassword = require("../../model/forgot-password.model");
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


// [GET] /user/password/forgot
module.exports.forgotPassword = (req,res) => {
    res.render("client/pages/users/forgot",{
        titlePage : "Quên Mật Khẩu"
    })
}


// [POST] /user/password/forgot
module.exports.forgotPasswordPost = async (req,res) => {
    const email = req.body.email;
    const existEmail = await User.findOne({email : email, deleted :false});
    if(!existEmail) {
        req.flash("error","Tài Khoản Không Tồn Tại");
        res.redirect("back");
        return;
    }
    const otp = general.CreateNumberRamdom(8);
    const Objectforgot = {
        email : email,
        otp : otp,
        expireAt : new Date(Date.now() + 180 * 1000)
    }
    const Optexits = await ForgotPassword.findOne({email : email});
    if (Optexits) {
        req.flash("error","Bạn đã gửi mail xác nhận vui lòng không gửi trong 3 phút nữa");
        res.redirect("back");
        return;
    }
    const forgotPassword = new ForgotPassword(Objectforgot);
    await forgotPassword.save();
    res.redirect(`/user/password/otp?email=${email}`);
}   


// [GET] /user/password/otp
module.exports.optPassword = (req,res) => {
    const email = req.query.email;
    res.render("client/pages/users/opt-password",{
        titlePage : "Nhập mã OTP",
        email:email
    })
}


// [POST] /user/password/otp
module.exports.optPasswordPost = async (req,res) => {
    const email = req.body.email;
    const otp = req.body.otp;
    const OptExits = await ForgotPassword.findOne({email:email , otp : otp});
    if (!OptExits) {
        req.flash("error","OTP không hợp lệ");
        res.redirect("back");
        return;
    }
    const user = await User.findOne({email:email,deleted :false});
    res.cookie("tokenUser",user.tokenUser);
    res.redirect("/user/password/reset");
}


// [GET] /user/password/reset
module.exports.resetPassword = (req,res) => {
    res.render("client/pages/users/reset",{
        titlePage : "Đổi mật khẩu",
    })
}


// [POST] /user/password/reset
module.exports.resetPasswordPost = async (req,res) => {
    const password = req.body.password;
    console.log(req.cookies.tokenUser);
    await User.updateOne({tokenUser : req.cookies.tokenUser},{
        password: md5(password)
    })
    req.flash("success","Thay đổi mật khẩu thành công");
    res.redirect("/");
}