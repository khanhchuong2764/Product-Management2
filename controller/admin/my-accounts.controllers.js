const Account = require("../../model/accounts.model");
const md5 = require('md5');
// [GET] /admin/my-accounts
module.exports.index = (req,res) => {
    res.render("admin/pages/my-accounts/index",{
        titlePage: res.locals.user.fullName
    })  
}

// [GET] /admin/my-accounts/edit
module.exports.edit = (req,res) => {
    res.render("admin/pages/my-accounts/edit",{
        titlePage: "Chỉnh sửa thông tin cá nhân"
    })  
}

// [PATCH] /admin/my-accounts/edit
module.exports. editPatch = async (req,res) => {
    const id =res.locals.user.id;
    const ExisEmail = await Account.findOne({
        _id : {$ne : id},
        email:req.body.email,
        deleted: false
    })
    if(ExisEmail) {
        req.flash("error",`Email ${req.body.email} đã tồn tại`);
        res.redirect("back");
    }else {
        if(req.body.password) {
            req.body.password = md5(req.body.password);
        }else {
            delete req.body.password;
        }
        await Account.updateOne({_id :id }, req.body);
        req.flash("success","Cập Nhật Tài Khoản Thành Công");
        res.redirect("back");
    }
}