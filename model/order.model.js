const mongoose = require('mongoose');
const Orderchema = new mongoose.Schema(
    {   
        // user_id : String,
        cartId : String,
        userInfor: {
            fullName:String,
            phone:String,
            address:String
        },
        products: [
            {
                product_id: String,
                quantity: Number,   
                price : Number,
                discountPercentage:Number
            }
        ],
        status : {
            type:String,
            default: "inittial"
        },
        deleted:{
            type:Boolean,
            default: false
        },
        deleteAt: Date
    }, {
        timestamps: true
    }
);


const Order = mongoose.model('Order', Orderchema,'orders');

module.exports = Order;