const Product = require("../../model/product.model");
const ProductHelper = require("../../helpers/products");

// [GET] /search
module.exports.index = async (req, res) => {
    let products = [];
    if (req.query.keyword) {
        const regex = new RegExp(req.query.keyword,"i");
        products = await Product.find({deleted : false ,status : "active", title : regex});
    }
    const product = ProductHelper.GetPriceNew(products);
    res.render("client/pages/search/index",{
        titlePage:"Kết quả tìm kiếm",
        product:product,
        keyword: req.query.keyword
    })
}