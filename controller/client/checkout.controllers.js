const Order = require("../../model/order.model");
const Cart = require("../../model/carts.model");
const Product = require("../../model/product.model");
const ProductHelper = require("../../helpers/products");
// [POST] /checkout
module.exports.index = async (req, res) => {
    const productsCart = JSON.parse(req.body.ids);
    let totalPriceProductAll = 0;
    for (const item of productsCart) {
        const productInfor = await Product.findOne(
            {
                _id : item.product_id , 
                deleted : false,
                status: "active"

            }
        ).select("thumbnail title price discountPercentage");
        productInfor.priceNew = ProductHelper.GetPriceNewItem(productInfor);
        item.productInfor = productInfor;
        item.totalPrice =  productInfor.priceNew * item.quantity;
        totalPriceProductAll +=  item.totalPrice ;
    }
    productsCart.totalPriceProductAll = totalPriceProductAll;
    res.render("client/pages/checkout/index",{
        titlePage:"Đặt Hàng",
        carts : productsCart
    })
}



// [POST] /checkout/order
module.exports.order = async (req, res) => {
    const cartId = req.cookies.cartId;
    const UserInfo = {
        fullName : req.body.fullName,
        phone : req.body.phone,
        address : req.body.address
    }
    const products = [];
    const CartProduct = JSON.parse(req.body.productCarts);
    for (const item of CartProduct) {
        const product = {
            product_id : item.product_id,
            quantity : parseInt(item.quantity),
            price : item.productInfor.price,
            discountPercentage : item.productInfor.discountPercentage
        }
        products.push(product);
    }
    const ObjectOrder = {
        cartId : cartId,
        userInfor :UserInfo,
        products : products
    };
    const productId = CartProduct.map(item => item.product_id);
    const order = new Order(ObjectOrder);
    await order.save();
    await Cart.updateOne({_id : cartId}, {
        $pull : {products : {product_id :{$in : productId}}}
    })

    res.redirect(`/checkout/success/${order.id}`);
}   



// [GET] /checkout/success/:orderId
module.exports.success = async (req, res) => {
    const orderId = req.params.orderId;
    let totalPriceProductAll = 0;
    const order = await Order.findOne({_id : orderId});
    for (const item of order.products) {
        const productInfor = await Product.findOne({_id : item.product_id}).select("title thumbnail");
        item.priceNew = ProductHelper.GetPriceNewItem(item);
        item.productInfor = productInfor;
        item.totalPrice = item.priceNew * item.quantity;
        totalPriceProductAll+=item.totalPrice;
    }
    order.totalPriceProductAll = totalPriceProductAll;
    res.render("client/pages/checkout/success",{
        titlePage:"Đặt Hàng Thành Công",
        order: order 
    })
}