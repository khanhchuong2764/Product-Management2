const Order = require("../../model/order.model");
const ProductHelper = require("../../helpers/products");


// [GET] /admin/order
module.exports.index = async (req, res) => {
    const orders = await Order.find({deleted: false});
    for (const order of orders) {
        let totalPriceAll = 0;
        for (const item of order.products) {
            item.priceNew = ProductHelper.GetPriceNewItem(item);
            item.totalPrice =  item.priceNew * item.quantity;
            totalPriceAll+= item.totalPrice;
        }
        order.totalPriceAll = totalPriceAll;
    }
    res.render("admin/pages/orders/index",{
        titlePage:"Danh Sách Đơn Hàng",
        orders:orders
    })  
}