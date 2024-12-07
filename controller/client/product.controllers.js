const Product = require("../../model/product.model");


// [GET] /product
module.exports.index = async (req, res) => {
    const product = await Product.find({
      status:"active",
      deleted:false
    }).sort({posittion:"desc"});
    const Newproduct = product.map(item => {
      item.priceNew = (item.price * (100 - item.discountPercentage)/100).toFixed(0);
      return item;
    });
    res.render("client/pages/products/index",{
      titlePage:"Danh Sach San Pham",
      product:Newproduct
    })
}

// [GET] /product/:slug
module.exports.detail = async (req, res) => {
  try {
    const find = {
        slug : req.params.slug,
        deleted : false,
        status : "active"
    }
    const record = await Product.findOne(find);
    res.render("client/pages/products/detail",{
        titlePage:record.title,
        record:record
    });
  } catch (error) {
      req.flash('error', 'Không tìm thấy sản phẩm');
      res.redirect(`/products`);
  }
}