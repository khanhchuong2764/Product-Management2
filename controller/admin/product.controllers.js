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
    const product = await Product.find(find).limit(ObjectPagination.limitItem).skip(ObjectPagination.skip);
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
    
        default:
            break;
    }
    res.redirect('back');
}


// [DELETE] /admin/products/delete/:id
module.exports.DeleteItem = async (req, res) => {
    const id = req.params.id;
    await Product.updateOne({_id: id},{deleted: true});
    res.redirect('back');
}
