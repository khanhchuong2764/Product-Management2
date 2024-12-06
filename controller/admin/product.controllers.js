const Product = require("../../model/product.model");
const FillterStatusHelper = require("../../helpers/FillterStatus");
const SearchHelper = require("../../helpers/search");
const PaginationHelper = require("../../helpers/pagination");


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
    //End Pagination
    const product = await Product.find(find)
    .sort({posittion:"desc"})
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
    res.redirect('back');
}

// [PATCH] /admin/products/change-multi
module.exports.ChangeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");
    switch (type) {
        case "active":
            await Product.updateMany({_id : {$in: ids}}, {status : "active"})
            break;
        case "inactive":
            await Product.updateMany({_id : {$in: ids}}, {status : "inactive"})
            break;
        case "delete-all":
            await Product.updateMany({_id : {$in: ids}},{
                    deleted : true,   
                    deleteAt: new Date()
                })
            break;
        case "posittion-change":
            for (const item of ids) {
                let[id,position] = item.split("-");
                position = parseInt(position);
                await Product.updateOne({_id: id},{posittion : position});
            }
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
            await Product.updateMany({_id : {$in: ids}}, {status : "active"})
            break;
        case "inactive":
            await Product.updateMany({_id : {$in: ids}}, {status : "inactive"})
            break;
        case "delete-all":
            await Product.deleteMany({_id : {$in: ids}});
            break;
        case "restore-all":
            await Product.updateMany({_id : {$in: ids}}, {deleted : false})
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
    res.redirect('back');
}

// [DELETE] /admin/products/restore/:id
module.exports.RestoreItem = async (req, res) => {
    const id = req.params.id;
    await Product.updateOne({_id: id},{
        deleted: false, 
    });
    res.redirect('back');
}

