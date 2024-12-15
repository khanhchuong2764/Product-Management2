const ProductCategory = require("../../model/product-category.model");
const CreateTreeHelper = require("../../helpers/createHelper");
module.exports.category = async (req,res,next) => {
    const CategoryProduct = await ProductCategory.find({
        deleted :false
    })
    const NewRecords = CreateTreeHelper.tree(CategoryProduct);
    res.locals.categoryproduct = NewRecords;
    next();
}