const SettingGeneral = require("../../model/setting-general.model");

module.exports.generalSetting = async (req,res,next) => {
    const Settinggeneral = await SettingGeneral.findOne({});
    res.locals.Settinggeneral=Settinggeneral;
    next();
}