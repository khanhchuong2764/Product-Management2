const ProductCategory = require("../../model/product-category.model");
const SystemConfig = require("../../config/system");
const FillterStatusHelper = require("../../helpers/FillterStatus");
const SearchHelper = require("../../helpers/search");
const CreateTreeHelper = require("../../helpers/createHelper");
// [GET] /admin/product-category
module.exports.index = async (req,res) => {
    const FillterStatus = FillterStatusHelper(req.query);
    const find = {
        deleted : false
    };
    // Bộ Lọc
    if (req.query.status) {
        find.status = req.query.status
    }
    //End Bộ Lọc
    //Tìm Kiếm
    const ObjectSearch=SearchHelper(req.query);
    if (ObjectSearch.regex) {
        find.title = ObjectSearch.regex;
    }   
    // End Tìm Kiếm
    const sort = {};
    if (req.query.sortkey && req.query.sortValue) {
        sort[req.query.sortkey] = req.query.sortValue;
    }else { 
        sort.posittion = "desc";
    }
    const records = await ProductCategory.find(find).sort(sort);
    const NewRecords = CreateTreeHelper.tree(records);
    res.render("admin/pages/product-category/index",{
        titlePage:"Danh Mục Sản Phẩm",
        records :NewRecords,
        FillterStatus:FillterStatus,
        keyword:ObjectSearch.keyword,
    })  
}
// [GET] /admin/product-category/create
module.exports.create = async (req,res) => {
    const find = {
        deleted : false
    };
    const records = await ProductCategory.find(find);
    const NewRecords = CreateTreeHelper.tree(records);
    res.render("admin/pages/product-category/create",{
        titlePage:"Tạo Danh Mục Sản Phẩm",
        records :NewRecords
    })  
}

// [POST] /admin/product-category/create
module.exports.createPost = async (req,res) => {
    if(!res.locals.role.permission.includes("products-category-create")) {
        return;
    }
    try {
        if(req.body.posittion == "") {
            const count = await ProductCategory.countDocuments();
            req.body.posittion = count + 1;
        }else {
            req.body.posittion = parseInt(req.body.posittion);
        }
        const category = new ProductCategory(req.body);
        await category.save(); 
        req.flash('success', `Tạo danh mục ${req.body.title} thành công`);
        res.redirect(`${SystemConfig.PrefixAdmin}/product-category`);
    } catch (error) {
        req.flash('error', `Tạo danh mục thất bại`);
        res.redirect(`${SystemConfig.PrefixAdmin}/product-category`);
    }
}

// [DELETE] /admin/product-category/delete/:id
module.exports.deleteItem = async (req,res) => {
    if(!res.locals.role.permission.includes("products-category-delete")) {
        return;
    }
    const id = req.params.id;
    await ProductCategory.updateOne({_id : id}, {deleted : true});
    req.flash("success", "Xóa Danh Mục Thành Công");
    res.redirect("back");
}


// [PATCH] /admin/product-category/change-status/:status/:id
module.exports.ChangeStatus = async (req,res) => {
    if(!res.locals.role.permission.includes("products-category-changeStatus")) {
        return;
    }
    const id = req.params.id;
    const status = req.params.status;
    await ProductCategory.updateOne({_id : id}, {status : status});
    req.flash("success", "Thay Đổi Trạng Thái Danh Mục Thành Công");
    res.redirect("back");
}

// [PATCH] /admin/product-category/change-multi
module.exports.ChangeMulti = async (req, res) => {
    if(!res.locals.role.permission.includes("products-category-edit")) {
        return;
    }
    const type = req.body.type;
    const ids = req.body.ids.split(", ");
    switch (type) {
        case "active":
            await ProductCategory.updateMany({_id : {$in: ids}}, {status : "active"})
            req.flash('success', `Cập nhật trạng thái thành công ${ids.length} danh mục sản phẩm`);
            break;
        case "inactive":
            await ProductCategory.updateMany({_id : {$in: ids}}, {status : "inactive"});
            req.flash('success', `Cập nhật trạng thái thành công ${ids.length} danh mục sản phẩm`);
            break;
        case "delete-all":
            await ProductCategory.updateMany({_id : {$in: ids}},{
                    deleted : true,   
                    deleteAt: new Date()
                });
            req.flash('success', `Đã xóa thành công ${ids.length} danh mục sản phẩm`);
            break;
        case "posittion-change":
            for (const item of ids) {
                let[id,position] = item.split("-");
                position = parseInt(position);
                await ProductCategory.updateOne({_id: id},{posittion : position});
            };
            req.flash('success', `Thay đổi vị trí thành công ${ids.length} danh mục sản phẩm`);
            break;
        default:
            break;
    }
    res.redirect('back');
}


// [GET] /admin/product-category/edit/:id
module.exports.edit = async (req,res) => {
    try {
        const id = req.params.id;
        const find = {
            deleted : false,
        };
        const records = await ProductCategory.find(find);
        const NewRecords = CreateTreeHelper.tree(records);
        const data = await ProductCategory.findOne({_id : id,deleted : false});
        res.render("admin/pages/product-category/edit",{
            titlePage:"Chỉnh Danh Mục Sản Phẩm",
            records :NewRecords,
            data:data
        })  
    } catch (error) {
        res.redirect(`${SystemConfig.PrefixAdmin}/product-category`);
    }
}

// [PATCH] /admin/product-category/edit/:id
module.exports.editPatch = async (req,res) => {
    if(!res.locals.role.permission.includes("products-category-edit")) {
        return;
    }
    try {
        const id = req.params.id;
        req.body.posittion = parseInt(req.body.posittion);
        await ProductCategory.updateOne({_id : id}, req.body);
        req.flash("success","Cập Nhật Thành Công");
    } catch (error) {
        req.flash("error","Cập Nhật Thất Bại");
    }
    res.redirect('back');
}


// [GET] /admin/product-category/detail/:id
module.exports.detail = async (req,res) => {
    const id = req.params.id;
    const record = await ProductCategory.findOne({_id : id, deleted : false});
    const parent_id = record.parent_id;
    let recordparent = {};
    if (parent_id) {
        recordparent = await ProductCategory.findOne({_id : parent_id ,deleted : false});
    }
    res.render("admin/pages/product-category/detail",{
        titlePage: record.title,
        record:record,
        recordparent:recordparent
    })
}