const Product = require("../../model/product.model");


module.exports.index = async(req, res) => {
    const product = await Product.find({
        deleted:false
    });
    console.log(product);
    res.render("admin/pages/products/index",{
        titlePage:"Danh Sách Sản Phẩm",
        product:product
    })  
}