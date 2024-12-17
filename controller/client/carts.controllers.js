const Cart = require("../../model/carts.model");
const Product = require("../../model/product.model");



// [POST] /cart/add/:id
module.exports.addPost = async (req, res) => {
    const id = req.params.id; 
    const quantity = parseInt(req.body.quantity);
    const cartId = req.cookies.cartId;
    const cart = await Cart.findOne({_id :cartId});
    const Exitsproducts = cart.products.find(item => item.product_id == id);
    if (Exitsproducts) {
        const quantityNew = quantity + Exitsproducts.quantity;
        console.log(quantityNew);
        await Cart.updateOne(
            {
                _id :cartId ,
                "products.product_id" : id
            }, {
                $set : {
                    "products.$.quantity" : quantityNew
                }
            }
        )
    }else {
        const ObjectCart = {
            product_id : id,
            quantity :quantity
        };
        await Cart.updateOne({_id : cartId},{$push: {products : ObjectCart}});
    }
    req.flash("success","Thêm sản phẩm vào giỏ hàng thành công");
    res.redirect("back");
}