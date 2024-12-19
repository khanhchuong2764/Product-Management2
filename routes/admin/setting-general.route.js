const express = require('express');
const multer  = require('multer');
const upload = multer();
const UploadsCloud = require("../../middleware/admin/UploadCloud");
const controller =require("../../controller/admin/setting-general.controllers");
const Router = express.Router();

Router.get('/general', controller.general);

Router.patch('/general',upload.single('logo'),UploadsCloud.upload, controller.generalPatch);

module.exports = Router;