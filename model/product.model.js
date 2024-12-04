const mongoose = require('mongoose');
const Productschema = new mongoose.Schema(
    {   
        title:String,
        price:Number,
        discountPercentage:Number,
        description:String,
        status:String,
        stock:Number,
        posittion:Number,
        thumbnail:String,
        deleted:Boolean
    }
);


const Product = mongoose.model('Product', Productschema,'products');

module.exports = Product;