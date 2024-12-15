const express = require('express');
const multer  = require('multer');
const upload = multer();
const Router = express.Router();
const UploadsCloud = require("../../middleware/admin/UploadCloud");
const Controller =require("../../controller/admin/my-accounts.controllers");
const Validate = require("../../validates/admin/my-accounts.validate");

Router.get('/', Controller.index);

Router.get('/edit', Controller.edit);

Router.patch('/edit',
    upload.single('avatar'),
    UploadsCloud.upload,
    Validate.editPatch,
    Controller.editPatch);

module.exports = Router;