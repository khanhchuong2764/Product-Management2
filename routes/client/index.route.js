const ProductRouter = require("./product.route");
const HomeRouter = require("./home.route");
const SearchRouter = require("./search.route");
const CartRouter = require("./cart.route");
const CheckoutRouter = require("./checkout.route");
const OrderRouter = require("./order.route");
const CategoryMiddelWare = require("../../middleware/client/category.middleware");
const CartMiddelWare = require("../../middleware/client/cart.middelware");

module.exports = (app) => {
    app.use(CategoryMiddelWare.category);
    app.use(CartMiddelWare.cartId);
    app.use('/', HomeRouter)
      
    app.use('/product',ProductRouter)

    app.use('/search',SearchRouter)

    app.use('/cart',CartRouter)

    app.use('/checkout',CheckoutRouter)

    app.use('/order',OrderRouter)
}