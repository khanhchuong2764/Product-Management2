const Order = require("../../model/order.model");
const ProductHelper = require("../../helpers/products");

// [GET] /order
module.exports.index = async (req, res) => {
    const cartId = req.cookies.cartId;
    const orders = await Order.find({cartId:cartId});
    for (const order of orders) {
        let totalPriceAll = 0;
        for (const item of order.products) {
            item.priceNew = ProductHelper.GetPriceNewItem(item);
            item.totalPrice =  item.priceNew * item.quantity;
            totalPriceAll+= item.totalPrice;
        }
        order.totalPriceAll = totalPriceAll;
    }
    res.render("client/pages/orders/index",{
        titlePage:"Đơn Hàng Đã Đặt",
        orders:orders
    })  
}