const uploadCloudianry = require("../../helpers/uploadCloudinaryHelper");
module.exports.upload = async (req, res, next) => {
    if (req.file) {
        const link = await uploadCloudianry(req.file.buffer);
        req.body[req.file.fieldname] = link;
        next();
    }else {
        next();
    }
}

