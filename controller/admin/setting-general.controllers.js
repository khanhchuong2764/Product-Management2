const SettingGeneral = require("../../model/setting-general.model");
// [GET] /admin/setting/general
module.exports.general =async(req,res) => {
    const settingGeneral = await SettingGeneral.findOne({});
    res.render("admin/pages/setting/general",{
        titlePage: "Cài đặt chung",
        settingGeneral:settingGeneral
    })
}

// [PATCH] /admin/setting/general
module.exports.generalPatch = async (req,res) => {
    console.log(req.body);
    const generalExist = await SettingGeneral.findOne({});
    if(generalExist) {
        await SettingGeneral.updateOne({_id :generalExist.id },req.body);
    }else {
        const general = new SettingGeneral(req.body);
        await general.save();
    }
    req.flash("success","Cập nhật thông tin thành công");
    res.redirect("back");
}