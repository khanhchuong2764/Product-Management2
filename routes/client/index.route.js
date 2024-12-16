const ProductRouter = require("./product.route");
const HomeRouter = require("./home.route");
const SearchRouter = require("./search.route");
const CategoryMiddelWare = require("../../middleware/client/category.middleware");

module.exports = (app) => {
    app.use(CategoryMiddelWare.category);
    app.use('/', HomeRouter)
      
    app.use('/product',ProductRouter)

    app.use('/search',SearchRouter)
}