const Account = require("../../model/accounts.model");
const Role = require("../../model/roles.model");
const SystemConfig = require("../../config/system");
const md5 = require('md5');
// [GET] /admin/accounts
module.exports.index = async (req, res) => {
    const find = {
        deleted : false
    }
    const records = await Account.find(find).select("-password -token");
    for (const item of records) {
        const role = await Role.findOne({_id : item.role_id, deleted :false});
        item.role = role;
    }
    res.render("admin/pages/accounts/index",{
        titlePage:"Danh Sách Tài Khoản",
        records:records
    })  
}

// [GET] /admin/accounts/create
module.exports.create = async (req, res) => {
    const roles = await Role.find({
        deleted:false
    })
    res.render("admin/pages/accounts/create",{
        titlePage:"Tạo Mới Tài Khoản",
        roles:roles
    })  
}

// [POST] /admin/accounts/create
module.exports.createPost = async (req, res) => {
    const ExisEmail = await Account.findOne({
        email:req.body.email,
        deleted: false
    })
    if(ExisEmail) {
        req.flash("error",`Email ${req.body.email} đã tồn tại`);
        res.redirect("back");
    }else {
        req.body.password = md5(req.body.password);
        const record = new Account(req.body);
        await record.save();
        req.flash("success", "Tạo tài khoản thành công");
        res.redirect(`${SystemConfig.PrefixAdmin}/accounts`);   
    }
}


// [GET] /admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const find = {
            _id : req.params.id,
            deleted: false
        };
        const roles = await Role.find({
            deleted:false
        })
        const data = await Account.findOne(find);
        res.render("admin/pages/accounts/edit",{
            titlePage:"Chỉnh Sửa Tài Khoản",
            roles:roles,
            data:data
        })
    } catch (error) {
        res.redirect(`${SystemConfig.PrefixAdmin}/accounts`);
    }
}

// [POST] /admin/accounts/edit/:id
module.exports.editPatch = async (req, res) => {
    const id =req.params.id;
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
