const Role = require("../../model/roles.model");
const SystemConfig = require("../../config/system");
// [GET] /admin/roles
module.exports.index = async (req, res) => {
    const find = {
        deleted :false
    }
    const record = await Role.find(find);
    res.render("admin/pages/roles/index",{
        titlePage:"Nhóm Quyền",
        record : record
    })  
}


// [GET] /admin/roles/create
module.exports.create = (req, res) => {
    res.render("admin/pages/roles/create",{
        titlePage:"Tạo Nhóm Quyền"
    })  
}

// [POST] /admin/roles/create
module.exports.createPost = async (req, res) => {
    if(!res.locals.role.permission.includes("roles-create")) {
        return;
    }
    try {
        const record = new Role(req.body);
        await record.save();
        req.flash("success", "Tạo nhóm quyền thành công");
        res.redirect(`${SystemConfig.PrefixAdmin}/roles`);
    } catch (error) {
        req.flash("error", "Tạo nhóm quyền thất bại");
        res.redirect(`${SystemConfig.PrefixAdmin}/roles`);
    }
}


// [DELETE] /admin/roles/delete/:id
module.exports.delete = async (req, res) => {
    if(!res.locals.role.permission.includes("roles-delete")) {
        return;
    }
    const id = req.params.id;
    await Role.updateOne({_id : id}, {deleted : true});
    req.flash('success',"Xóa Nhóm Quyền Thành Công");
    res.redirect('back');
}



// [GET] /admin/roles/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;
        const find = {
            deleted : false,
            _id : id
        }
        const record = await Role.findOne(find);
        res.render("admin/pages/roles/edit",{
            titlePage:"Chỉnh Sửa Nhóm Quyền",
            record : record
        }) 
    } catch (error) {
        res.redirect(`${SystemConfig.PrefixAdmin}/roles`);
    }
}

// [PATCH] /admin/roles/edit/:id
module.exports.editPatch = async (req, res) => {
    if(!res.locals.role.permission.includes("roles-edit")) {
        return;
    }
    try {
        const id = req.params.id;
        await Role.updateOne({_id : id}, req.body);
        req.flash('success',"Cập Nhật Nhóm Quyền Thành Công");
    } catch (error) {
        req.flash('error',"Cập Nhật Nhóm Quyền Thất Bại");
    }
    res.redirect('back');
}

// [GET] /admin/roles/detail/:id
module.exports.detail = async (req, res) => {
    const id = req.params.id;
    const find = {
        deleted:false,
        _id : id
    }
    const record =await Role.findOne(find);
    res.render("admin/pages/roles/detail",{
        titlePage:record.title,
        record : record
    }) 
}


// [GET] /admin/roles/permission
module.exports.permission = async (req, res) => {
    const find = {
        deleted:false
    }
    const records = await Role.find(find);
    res.render("admin/pages/roles/permission",{
        titlePage:"Phân Quyền",
        records:records
    })  
}

// [Patch] /admin/roles/permission
module.exports.permissionPatch= async (req, res) => {
    if(!res.locals.role.permission.includes("roles-permissions")) {
        return;
    }
    const permission = JSON.parse(req.body.permission);
    for (const item of permission) {
        await Role.updateOne({_id : item.id}, {permission: item.permission});
    }
    req.flash("success","Cập Nhật Phân Quyền Thành Công");
    res.redirect("back");
}
