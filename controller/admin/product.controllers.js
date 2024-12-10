const Product = require("../../model/product.model");
const FillterStatusHelper = require("../../helpers/FillterStatus");
const SearchHelper = require("../../helpers/search");
const PaginationHelper = require("../../helpers/pagination");
const SystemConfig = require("../../config/system");

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
    const ObjectPagination =PaginationHelper({
        limitItem: 3,
        currentPage: 1
    },
        CountProduct,
        req.query
    );
    const sort = {};
    if (req.query.sortkey && req.query.sortValue) {
        sort[req.query.sortkey] = req.query.sortValue;
    }else { 
        sort.posittion = "desc";
    }
    //End Pagination
    const product = await Product.find(find)
    .sort(sort)
    .limit(ObjectPagination.limitItem)
    .skip(ObjectPagination.skip);
    res.render("admin/pages/products/index",{
        titlePage:"Danh Sách Sản Phẩm",
        product:product,
        FillterStatus:FillterStatus,
        keyword:ObjectSearch.keyword,
        pagination:ObjectPagination
    })  
}
// [PATCH] /admin/products/change-status/:status/:id
module.exports.ChangeStatus = async (req, res) => {
    const id = req.params.id;
    const status = req.params.status;
    await Product.updateOne({_id: id},{status:status});
    req.flash('success', 'Thay đổi trạng thái sản phẩm thành công');
    res.redirect('back');
}

// [PATCH] /admin/products/change-multi
module.exports.ChangeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");
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
                    deleteAt: new Date()
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
    const id = req.params.id;
    await Product.updateOne({_id: id},{
        deleted: true,
        deleteAt: new Date()    
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
    const id = req.params.id;
    await Product.deleteOne({_id: id});
    req.flash('success', 'Xóa sản phẩm thành công');
    res.redirect('back');
}

// [DELETE] /admin/products/restore/:id
module.exports.RestoreItem = async (req, res) => {
    const id = req.params.id;
    await Product.updateOne({_id: id},{
        deleted: false, 
    });
    req.flash('success', 'Khôi phục sản phẩm thành công');
    res.redirect('back');
}

// [GET] /admin/products/create
module.exports.create = (req, res) => {
    res.render("admin/pages/products/create",{
        titlePage:"Thêm Mới Sản Phẩm"
    });
}

// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {
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
        res.render("admin/pages/products/edit",{
            titlePage:"Chỉnh Sửa Sản Phẩm",
            record:record
        });
    } catch (error) {
        req.flash('error', 'Không tìm thấy sản phẩm');
        res.redirect(`${SystemConfig.PrefixAdmin}/products`);
    }
}

// [PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
    console.log(req.body);
    const id = req.params.id;
    req.body.price= parseInt(req.body.price);
    req.body.discountPercentage= parseInt(req.body.discountPercentage);
    req.body.stock= parseInt(req.body.stock);
    req.body.posittion= parseInt(req.body.posittion);
    if(req.file) {
        req.body.thumbnail = `/uploads/${req.file.filename}`;
    }
    try {
        await Product.updateOne({_id : id}, req.body);
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