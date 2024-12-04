const ProductRouter = require("./product.route");
const HomeRouter = require("./home.route");

module.exports = (app) => {
    app.use('/', HomeRouter)
      
    app.use('/product',ProductRouter)
}