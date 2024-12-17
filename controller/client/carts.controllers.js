const Cart = require("../../model/carts.model");
const Product = require("../../model/product.model");
const ProductHelper = require("../../helpers/products");
// [GET] /cart/
module.exports.index = async (req, res) => {
    const cartId = req.cookies.cartId;
    const cart = await Cart.findOne({_id : cartId});
    let totalPriceProductAll = 0;
    if (cart.products.length > 0) {
        for (const item of cart.products) {
            const product_id = item.product_id;
            const productInfor = await Product.findOne(
                {
                    _id : product_id 
                    ,deleted :false,
                    status:"active"
                }
            ).select("thumbnail title price discountPercentage slug");
            productInfor.priceNew = ProductHelper.GetPriceNewItem(productInfor);
            item.productInfor = productInfor;
            item.totalPrice =  productInfor.priceNew * item.quantity;
            totalPriceProductAll +=  item.totalPrice ;
        }
    }
    cart.totalPriceProductAll = totalPriceProductAll;
    res.render("client/pages/cart/index",{
        titlePage:"Giỏ Hàng",
        carts:cart
    })
}


// [POST] /cart/add/:id
module.exports.addPost = async (req, res) => {
    const id = req.params.id; 
    const quantity = parseInt(req.body.quantity);
    const cartId = req.cookies.cartId;
    const cart = await Cart.findOne({_id :cartId});
    const Exitsproducts = cart.products.find(item => item.product_id == id);
    if (Exitsproducts) {
        const quantityNew = quantity + Exitsproducts.quantity;
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


// [GET] /cart/delete/:productId
module.exports.delete = async (req, res) => {
    const id = req.params.productId;
    const cartId = req.cookies.cartId;
    await Cart.updateOne({_id : cartId} , {
        $pull : {products : {product_id : id}}
    })
    req.flash("success","Đã xóa sản phẩm khỏi giỏ hàng");
    res.redirect("back");
}

// [GET] cart/update/:productId/:quantity
module.exports.updateQuantity = async (req, res) => {
    const product_id = req.params.productId;
    const quantity = req.params.quantity;
    const cartId = req.cookies.cartId;
    await Cart.updateOne({
        _id:cartId,
        "products.product_id" : product_id
    },{
        $set : {
            "products.$.quantity" : quantity
        }
    })
    req.flash("success","Cập nhật số lượng thành công");
    res.redirect("back");
}