const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);
const Productschema = new mongoose.Schema(
    {   
        title:String,
        product_category_id : {
            type:String,
            default :""
        },
        price:Number,
        discountPercentage:Number,
        description:String,
        status:String,
        stock:Number,
        posittion:Number,
        slug: { 
            type: String, 
            slug: "title",
            unique: true  
        },
        thumbnail:String,
        deleted:{
            type:Boolean,
            default: false
        },
        deleteAt: Date
    }, {
        timestamps: true
    }
);


const Product = mongoose.model('Product', Productschema,'products');

module.exports = Product;