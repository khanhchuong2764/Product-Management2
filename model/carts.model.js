const mongoose = require('mongoose');
const Cartschema = new mongoose.Schema(
    {   
        user_id :String,
        products : [
            {
                product_id : String,
                quantity : Number
            }
        ]
    }, {
        timestamps: true
    }
);


const Cart = mongoose.model('Cart', Cartschema,'carts');

module.exports = Cart;