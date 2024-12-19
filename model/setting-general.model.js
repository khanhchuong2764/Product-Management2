const mongoose = require('mongoose');
const settingGeneralSchema = new mongoose.Schema(
    {   
        websiteName: String,
        logo: String,
        phone:String,
        email:String,
        address:String,
        CopyRight: String
    },{
        timestamps:true
    }
);


const SettingGeneral = mongoose.model('SettingGeneral', settingGeneralSchema,'setting-general');

module.exports = SettingGeneral;