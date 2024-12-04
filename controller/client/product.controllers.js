const Product = require("../../model/product.model");



module.exports.index = async (req, res) => {
    const product = await Product.find({
      status:"active",
      deleted:false
    });
    const Newproduct = product.map(item => {
      item.priceNew = (item.price * (100 - item.discountPercentage)/100).toFixed(0);
      return item;
    });
    res.render("client/pages/products/index",{
      titlePage:"Danh Sach San Pham",
      product:Newproduct
    })
}