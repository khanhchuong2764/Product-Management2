const ProductCategory = require("../../model/product-category.model");
const Product = require("../../model/product.model");
const User = require("../../model/user.model");
const Account = require("../../model/accounts.model");
const Order = require("../../model/order.model");
// [GET] /admin/dashboard
module.exports.dashboard = async (req, res) => {
    const statistic = {
        ProductCategory:{
            total: 0,
            active:0,
            inactive:0
        },
        products:{
            total: 0,
            active:0,
            inactive:0
        },
        account:{
            total: 0,
            active:0,
            inactive:0
        },
        user:{
            total: 0,
            active:0,
            inactive:0
        },
        order:{
            total: 0,
            initial:0,
            inactive:0
        }
    }
    //ProductCategory
    statistic.ProductCategory.total = await ProductCategory.countDocuments({deleted:false});
    statistic.ProductCategory.active = await ProductCategory.countDocuments({deleted:false,status:"active"});
    statistic.ProductCategory.inactive = await ProductCategory.countDocuments({deleted:false,status:"inactive"});
    //products
    statistic.products.total = await Product.countDocuments({deleted:false});
    statistic.products.active = await Product.countDocuments({deleted:false,status:"active"});
    statistic.products.inactive = await Product.countDocuments({deleted:false,status:"inactive"});
    // Account
    statistic.account.total = await Account.countDocuments({deleted:false});
    statistic.account.active = await Account.countDocuments({deleted:false,status:"active"});
    statistic.account.inactive = await Account.countDocuments({deleted:false,status:"inactive"});
    // User
    statistic.user.total = await User.countDocuments({deleted:false});
    statistic.user.active = await User.countDocuments({deleted:false,status:"active"});
    statistic.user.inactive = await User.countDocuments({deleted:false,status:"inactive"});

    // Order
    statistic.order.total = await Order.countDocuments({deleted:false});
    statistic.order.inittial = await Order.countDocuments({deleted:false,status:"inittial"});
    res.render("admin/pages/dashboard/index",{
        titlePage:"Trang Tong Quan",
        statistic:statistic
    })  
}