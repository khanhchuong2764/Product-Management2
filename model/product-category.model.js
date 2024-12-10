const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);
const ProductCategoryschema = new mongoose.Schema(
    {   
        title:String,
        parent_id : {
            type :String,
            default: ""
        },
        description:String,
        status:String,
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


const ProductCategory = mongoose.model('ProductCategory', ProductCategoryschema,'products-category');

module.exports = ProductCategory;