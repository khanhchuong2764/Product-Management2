const Product = require("../../model/product.model");
const ProductHelper = require("../../helpers/products");


// [GET] /
module.exports.index = async (req, res) => {
    const ProductFeature = await Product.find(
        {
            deleted:false,
            status:"active",
            featured : "1"
        }).limit(5);
    const Newproduct = ProductHelper.GetPriceNew(ProductFeature);
    res.render("client/pages/home/index",{
        titlePage:"Trang Chu",
        ProductFeature:Newproduct
    })
}