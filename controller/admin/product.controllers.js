const Product = require("../../model/product.model");
const FillterStatusHelper = require("../../helpers/FillterStatus");
// [GET] /admin/products
module.exports.index = async(req, res) => {
    // Bộ Lọc
    const FillterStatus = FillterStatusHelper(req.query);
    // End Bộ Lọc
    const find = {
        deleted:false
    };

    // Search
    let keyword="";
    if (req.query.keyword) {
        keyword = req.query.keyword;
        const regex = new RegExp(keyword,"i");
        find.title = regex;
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
        keyword:keyword
    })  
}