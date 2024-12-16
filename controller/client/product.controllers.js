const Product = require("../../model/product.model");
const ProductHelper = require("../../helpers/products");
const ProductCategory = require("../../model/product-category.model");
const ProductCategoryHelper = require("../../helpers/product-category");
// [GET] /product
module.exports.index = async (req, res) => {
    const product = await Product.find({
      status:"active",
      deleted:false
    }).sort({posittion:"desc"});
    const Newproduct = ProductHelper.GetPriceNew(product);
    res.render("client/pages/products/index",{
      titlePage:"Danh Sach San Pham",
      product:Newproduct
    })
}

// [GET] /product//detail/:slugProduct
module.exports.detail = async (req, res) => {
  try {
    const find = {
        slug : req.params.slugProduct,
        deleted : false,
        status : "active"
    }
    const record = await Product.findOne(find);
    record.priceNew = ProductHelper.GetPriceNewItem(record);
    if(record.product_category_id){
      const category = await ProductCategory.findOne({_id : record.product_category_id, deleted :false,status :"active"});
      record.category = category;
    }
    res.render("client/pages/products/detail",{
        titlePage:record.title,
        record:record
    });
  } catch (error) {
      req.flash('error', 'Không tìm thấy sản phẩm');
      res.redirect(`/products`);
  }
}


// [GET] /product/:slug
module.exports.getProductCategory = async (req, res) => {
  const Category = await ProductCategory.findOne({
    slug :req.params.slugProductCategory,
    deleted :false,
    status :"active"
  })
  const CategoryMenu = await ProductCategoryHelper.getSub(Category.id);
  const IdCategory = CategoryMenu.map(item => item.id);
  const Productnewsss = await Product.find({
    deleted :false,
    status:"active",
    product_category_id: {$in : [Category.id,...IdCategory]}
  }).sort({posittion:"desc"});
  const Newproduct = ProductHelper.GetPriceNew(Productnewsss);
  res.render("client/pages/products/index",{
    titlePage: Category.title,
    product: Newproduct
  })
}