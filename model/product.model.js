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
        createdBy : {
            account_id : String,
            createdAt: {
                type: Date,
                default : Date.now
            }
        },
        deletedBy : {
            account_id : String,
            deletedAt: Date
        },
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
    }, {
        timestamps: true
    }
);


const Product = mongoose.model('Product', Productschema,'products');

module.exports = Product;