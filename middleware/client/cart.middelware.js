const Cart = require("../../model/carts.model");

module.exports.cartId = async (req,res,next) => {
    const cartId = req.cookies.cartId;
    if(!cartId) {
        const cart = new Cart();
        await cart.save();
        const expireCartId = 1000 * 60 * 60 * 24 * 365;
        res.cookie('cartId',cart.id, { expires: new Date(Date.now() + expireCartId) })
    }else {
        const cart = await Cart.findOne({_id : cartId})
        const totalQuantity = cart.products.reduce((total,item) => {
            return total + item.quantity;
        },0);
        cart.totalQuantity = totalQuantity;
        res.locals.cart = cart;
    }
    next();
}