const Account = require("../../model/accounts.model");
const Role = require("../../model/roles.model");
const SystemConfig = require("../../config/system");
const FillterStatusHelper = require("../../helpers/FillterStatus");
const SearchHelper = require("../../helpers/search");
const PaginationHelper = require("../../helpers/pagination");
const md5 = require('md5');
// [GET] /admin/accounts
module.exports.index = async (req, res) => {
    // Bộ Lọc
    const FillterStatus = FillterStatusHelper(req.query);
    // End Bộ Lọc
    const find = {
        deleted : false
    }
    // Search
    const ObjectSearch=SearchHelper(req.query);
    if (ObjectSearch.regex) {
        find.fullName = ObjectSearch.regex;
    }
    // End Search 
    if (req.query.status) {
        find.status = req.query.status;
    }
    // Pagination
    const CountAccount = await Account.countDocuments(find);
    const ObjectPagination =PaginationHelper({
        limitItem: 6,
        currentPage: 1
    },
        CountAccount,
        req.query
    );
    // End Pagination
    // Role
    if(req.query.role_id){
        find.role_id = req.query.role_id;
    }
    // End Role
    const Roles = await Role.find({deleted : false});
    const records = await Account.find(find).select("-password -token").limit(ObjectPagination.limitItem)
    .skip(ObjectPagination.skip);;
    for (const item of records) {
        const role = await Role.findOne({_id : item.role_id, deleted :false});
        item.role = role;
    }
    res.render("admin/pages/accounts/index",{
        titlePage:"Danh Sách Tài Khoản",
        records:records,
        FillterStatus:FillterStatus,
        keyword:ObjectSearch.keyword,
        pagination:ObjectPagination,
        Roles:Roles
    })  
}

// [GET] /admin/accounts/create
module.exports.create = async (req, res) => {
    const roles = await Role.find({
        deleted:false
    })
    res.render("admin/pages/accounts/create",{
        titlePage:"Tạo Mới Tài Khoản",
        roles:roles,
    })  
}

// [POST] /admin/accounts/create
module.exports.createPost = async (req, res) => {
    if(!res.locals.role.permission.includes("accounts-create")) {
        return;
    }
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
    if(!res.locals.role.permission.includes("accounts-edit")) {
        return;
    }
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

// [DELETE] /admin/accounts/delete/:id
module.exports.delete = async (req, res) => {
    if(!res.locals.role.permission.includes("accounts-delete")) {
        return;
    }
    const id = req.params.id;
    await Account.updateOne({_id :id},{deleted : true});
    req.flash("success","Xóa tài khoản thành công");
    res.redirect("back");
}

// [PATCH] /admin/accounts/change-Status/:status/:id
module.exports.ChangeStatus = async (req, res) => {
    if(!res.locals.role.permission.includes("accounts-edit")) {
        return;
    }
    const id = req.params.id;
    const status = req.params.status;
    await Account.updateOne({_id :id},{status : status});
    req.flash("success","Thay đổi trạng thái tài khoản thành công");
    res.redirect("back");
}


// [GET] /admin/accounts/detail/:id
module.exports.detail = async (req, res) => {
    const id = req.params.id;
    const record = await Account.findOne({_id : id , deleted :false});
    const role = await Role.findOne({_id : record.role_id});
    record.roleTitle = role.title;
    res.render("admin/pages/accounts/detail",{
        titlePage:"Chi Tiết Tài Khoản",
        record:record
    })
}
