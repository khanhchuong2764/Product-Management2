const Product = require("../../model/product.model");
const FillterStatusHelper = require("../../helpers/FillterStatus");
const SearchHelper = require("../../helpers/search");
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

    const product = await Product.find(find);
    res.render("admin/pages/products/index",{
        titlePage:"Danh Sách Sản Phẩm",
        product:product,
        FillterStatus:FillterStatus,
        keyword:ObjectSearch.keyword
    })  
}