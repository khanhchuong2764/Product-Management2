const express = require('express');
const multer  = require('multer');
const upload = multer();
const Router = express.Router();
const controller = require("../../controller/admin/product-category.controllers");
const UploadsCloud = require("../../middleware/admin/UploadCloud");
const ProductCategoryValidate = require("../../validates/admin/product-category.validate");

Router.get('/', controller.index);

Router.get('/create', controller.create);

Router.patch('/change-status/:status/:id', controller.ChangeStatus);

Router.patch('/change-multi', controller.ChangeMulti);

Router.post('/create',upload.single('thumbnail'),UploadsCloud.upload,ProductCategoryValidate.createPost, controller.createPost);

Router.delete('/delete/:id', controller.deleteItem);

Router.get('/edit/:id', controller.edit);

Router.patch('/edit/:id',upload.single('thumbnail'),UploadsCloud.upload,ProductCategoryValidate.createPost, controller.editPatch);

Router.get('/detail/:id', controller.detail);

module.exports = Router;