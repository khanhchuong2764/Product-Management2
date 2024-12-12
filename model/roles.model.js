const mongoose = require('mongoose');
const Roleschema = new mongoose.Schema(
    {   
        title:String,
        description:String,
        permission : {
            type:Array,
            default : []
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


const Role = mongoose.model('Role', Roleschema,'roles');

module.exports = Role;