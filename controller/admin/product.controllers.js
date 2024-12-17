const Product = require("../../model/product.model");
const Account = require("../../model/accounts.model");
const ProductCategory = require("../../model/product-category.model");
const FillterStatusHelper = require("../../helpers/FillterStatus");
const SearchHelper = require("../../helpers/search");
const PaginationHelper = require("../../helpers/pagination");
const SystemConfig = require("../../config/system");
const CreateTreeHelper = require("../../helpers/createHelper");
const ProductCategoryHelper = require("../../helpers/product-category");
// [GET] /admin/products
module.exports.index = async(req, res) => {
    // Bộ Lọc
    const FillterStatus = FillterStatusHelper(req.query);
    // End Bộ Lọc
    const find = {
        deleted:false
    };
    // Search
    const ObjectSearch=SearchHelper(req.query);
    if (ObjectSearch.regex) {
        find.title = ObjectSearch.regex;
    }
    // End Search 
    if (req.query.status) { 
        find.status = req.query.status;
    };
    // Pagination
    const CountProduct = await Product.countDocuments(find);
    let limitItem = 3;
    if(req.query.limitItem) {
        limitItem = parseInt(req.query.limitItem);
    }
    const ObjectPagination =PaginationHelper({
        limitItem: limitItem,
        currentPage: 1
    },
        CountProduct,
        req.query
    );
    //End Pagination
    // Sort
    const sort = {};
    if (req.query.sortkey && req.query.sortValue) {
        sort[req.query.sortkey] = req.query.sortValue;
    }else { 
        sort.posittion = "desc";
    }
    // End Sort
    // Fillter Product-Category
    if (req.query.categoryId) {
        const suBmenu = await ProductCategoryHelper.getSub(req.query.categoryId);
        const NewCategory = suBmenu.map(item => item.id);
        find.product_category_id = {$in : [req.query.categoryId, ...NewCategory]};
    }

    // End Fillter Product-Category
    const product = await Product.find(find)
    .sort(sort)
    .limit(ObjectPagination.limitItem)
    .skip(ObjectPagination.skip);
    for (const item  of product) {
        // Lấy thông tin người tạo
        const user = await Account.findOne({_id : item.createdBy.account_id}).select("fullName");
        if(user) {
            item.AccountFullName = user.fullName;
        }
        // End Lấy thông tin người tạo
        // Lấy thông tin người sửa gần nhất
        const updateBy = item.updatedBy[item.updatedBy.length - 1];
        if(updateBy) {
            const updateByAccount  = await Account.findOne({_id : updateBy.account_id});
            updateBy.AccountFullName = updateByAccount.fullName;
        }
        // End Lấy thông tin người sửa gần nhất
    }
    const CateogryProduct = await ProductCategory.find({deleted:false});
    const NewCategoryProduct = CreateTreeHelper.tree(CateogryProduct);
    res.render("admin/pages/products/index",{
        titlePage:"Danh Sách Sản Phẩm",
        product:product,
        FillterStatus:FillterStatus,
        keyword:ObjectSearch.keyword,
        pagination:ObjectPagination,
        NewCategoryProduct:NewCategoryProduct
    })  
}
// [PATCH] /admin/products/change-status/:status/:id
module.exports.ChangeStatus = async (req, res) => {
    if(res.locals.role.permission.includes("products-changeStatus")) {
        const id = req.params.id;
        const status = req.params.status;
        await Product.updateOne({_id: id},{status:status});
        req.flash('success', 'Thay đổi trạng thái sản phẩm thành công');
        res.redirect('back');
    }else {
        return;
    }
}

// [PATCH] /admin/products/change-multi
module.exports.ChangeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");
    if(!res.locals.role.permission.includes("products-edit")) {
        return;
    }
    switch (type) {
        case "active":
            await Product.updateMany({_id : {$in: ids}}, {status : "active"})
            req.flash('success', `Cập nhật trạng thái thành công ${ids.length} sản phẩm`);
            break;
        case "inactive":
            await Product.updateMany({_id : {$in: ids}}, {status : "inactive"});
            req.flash('success', `Cập nhật trạng thái thành công ${ids.length} sản phẩm`);
            break;
        case "delete-all":
            await Product.updateMany({_id : {$in: ids}},{
                    deleted : true,   
                    deletedBy: {
                        account_id : res.locals.user.id,
                        deletedAt: new Date()
                    }
                });
            req.flash('success', `Đã xóa thành công ${ids.length} sản phẩm`);
            break;
        case "posittion-change":
            for (const item of ids) {
                let[id,position] = item.split("-");
                position = parseInt(position);
                await Product.updateOne({_id: id},{posittion : position});
            };
            req.flash('success', `Thay đổi vị trí thành công ${ids.length} sản phẩm`);
            break;
        default:
            break;
    }
    res.redirect('back');
}

// [PATCH] /admin/products/trash/change-multi
module.exports.TrashChangeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");
    switch (type) {
        case "active":
            await Product.updateMany({_id : {$in: ids}}, {status : "active"});
            req.flash('success', `Cập nhật trạng thái thành công ${ids.length} sản phẩm`);
            break;
        case "inactive":
            await Product.updateMany({_id : {$in: ids}}, {status : "inactive"});
            req.flash('success', `Cập nhật trạng thái thành công ${ids.length} sản phẩm`);
            break;
        case "delete-all":
            await Product.deleteMany({_id : {$in: ids}});
            req.flash('success', `Đã xóa thành công ${ids.length} sản phẩm`);
            break;
        case "restore-all":
            await Product.updateMany({_id : {$in: ids}}, {deleted : false});
            req.flash('success', `Đã khôi phục thành công ${ids.length} sản phẩm`);
            break;
        default:
            break;
    }
    res.redirect('back');
}


// [DELETE] /admin/products/delete/:id
module.exports.DeleteItem = async (req, res) => {
    if(!res.locals.role.permission.includes("products-delete")) {
        return;
    }
    const id = req.params.id;
    await Product.updateOne({_id: id},{
        deleted: true,
        deletedBy: {
            account_id : res.locals.user.id,
            deletedAt: new Date()
        }
    });
    req.flash('success', 'Xóa sản phẩm thành công');
    res.redirect('back');
}


// [GET] /admin/products/trash
module.exports.Trash = async(req, res) => {
    // Bộ Lọc
    const FillterStatus = FillterStatusHelper(req.query);
    // End Bộ Lọc
    const find = {
        deleted:true
    };
    // Search
    const ObjectSearch=SearchHelper(req.query);
    if (ObjectSearch.regex) {
        find.title = ObjectSearch.regex;
    }
    // End Search 
    if (req.query.status) { 
        find.status = req.query.status;
    };
    // Pagination
    const CountProduct = await Product.countDocuments(find);
    const ObjectPagination =PaginationHelper({
        limitItem: 3,
        currentPage: 1
    },
        CountProduct,
        req.query
    );
    //End Pagination
    const product = await Product.find(find).limit(ObjectPagination.limitItem).skip(ObjectPagination.skip);
    res.render("admin/pages/products/trash",{
        titlePage:"Thùng Rác Danh Sách Sản Phẩm",
        product:product,
        FillterStatus:FillterStatus,
        keyword:ObjectSearch.keyword,
        pagination:ObjectPagination
    })  
}

// [DELETE] /admin/products/delete-permanently/:id
module.exports.Deletepermanetly = async (req, res) => {
    if(!res.locals.role.permission.includes("products-trash-delete")) {
        return;
    }
    const id = req.params.id;
    await Product.deleteOne({_id: id});
    req.flash('success', 'Xóa sản phẩm thành công');
    res.redirect('back');
}

// [DELETE] /admin/products/restore/:id
module.exports.RestoreItem = async (req, res) => {
    if(!res.locals.role.permission.includes("products-trash-create")) {
        return;
    }
    const id = req.params.id;
    await Product.updateOne({_id: id},{
        deleted: false, 
    });
    req.flash('success', 'Khôi phục sản phẩm thành công');
    res.redirect('back');
}

// [GET] /admin/products/create
module.exports.create = async (req, res) => {
    const find = {
        deleted : false
    };
    const records = await ProductCategory.find(find);
    const NewRecords = CreateTreeHelper.tree(records);
    res.render("admin/pages/products/create",{
        titlePage:"Thêm Mới Sản Phẩm",
        records:NewRecords
    });
}

// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {
    if(!res.locals.role.permission.includes("products-create")) {
        return;
    }
    try {
        req.body.price= parseInt(req.body.price);
        req.body.discountPercentage= parseInt(req.body.discountPercentage);
        req.body.stock= parseInt(req.body.stock);
        if(req.body.posittion == "") {
            const countProduct = await Product.countDocuments();
            req.body.posittion = countProduct + 1;
        }else {
            req.body.posittion= parseInt(req.body.posittion);
        }   
        req.body.createdBy = {
            account_id :res.locals.user.id
        }
        const product = new Product(req.body);
        await product.save();
        req.flash('success', 'Thêm mới sản phẩm thành công');
        res.redirect(`${SystemConfig.PrefixAdmin}/products`);
    } catch (error) {
        req.flash('error', 'Thêm mới sản phẩm thất bại');
        res.redirect(`${SystemConfig.PrefixAdmin}/products`);
    }
}


// [GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;
        const find = {
            _id : id,
            deleted : false
        }
        const record = await Product.findOne(find); 
        const records = await ProductCategory.find({deleted : false});
        const NewRecords = CreateTreeHelper.tree(records);
        res.render("admin/pages/products/edit",{
            titlePage:"Chỉnh Sửa Sản Phẩm",
            record:record,
            records:NewRecords
        });
    } catch (error) {
        req.flash('error', 'Không tìm thấy sản phẩm');
        res.redirect(`${SystemConfig.PrefixAdmin}/products`);
    }
}

// [PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
    if(!res.locals.role.permission.includes("products-edit")) {
        return;
    }
    const UpdatedBy = {
        account_id : res.locals.user.id,
        updatedAt: new Date()
    };
    const id = req.params.id;
    req.body.price= parseInt(req.body.price);
    req.body.discountPercentage= parseInt(req.body.discountPercentage);
    req.body.stock= parseInt(req.body.stock);
    req.body.posittion= parseInt(req.body.posittion);
    console.log(req.body);
    try {
        await Product.updateOne({_id : id}, { ...req.body , $push:{updatedBy : UpdatedBy}});
        req.flash('success', 'Cập nhật sản phẩm thành công');
    } catch (error) {
        req.flash('error', 'Cập nhật sản phẩm thất bại');
    }
    res.redirect('back');
}


// [GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id;
        const find = {
            _id : id,
            deleted : false
        }
        const record = await Product.findOne(find);
        res.render("admin/pages/products/detail",{
            titlePage:record.title,
            record:record
        });
    } catch (error) {
        req.flash('error', 'Không tìm thấy sản phẩm');
        res.redirect(`${SystemConfig.PrefixAdmin}/products`);
    }
}