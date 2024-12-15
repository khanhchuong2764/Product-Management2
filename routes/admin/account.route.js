const express = require('express');
const multer  = require('multer');
const upload = multer();
const UploadsCloud = require("../../middleware/admin/UploadCloud");
const controller =require("../../controller/admin/account.controllers");
const AccountValidate = require("../../validates/admin/accounts.validate");
const Router = express.Router();

Router.get('/', controller.index);

Router.get('/create', controller.create);

Router.post('/create',upload.single('avatar'),UploadsCloud.upload,AccountValidate.createPost,controller.createPost);

Router.get('/edit/:id', controller.edit);

Router.patch('/edit/:id',upload.single('avatar'),UploadsCloud.upload,AccountValidate.editPatch,controller.editPatch);

Router.delete('/delete/:id', controller.delete);

Router.patch('/change-status/:status/:id', controller.ChangeStatus);

Router.get('/detail/:id', controller.detail);
module.exports = Router;