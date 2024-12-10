const express = require('express');
const multer  = require('multer');
const upload = multer();
const ProductController =require("../../controller/admin/product.controllers");
const ProductValidate = require("../../validates/admin/products.validate");
const UploadsCloud = require("../../middleware/admin/UploadCloud");
const Router = express.Router();

Router.get('/', ProductController.index);

Router.patch('/change-status/:status/:id', ProductController.ChangeStatus);

Router.patch('/change-multi', ProductController.ChangeMulti);

Router.patch('/trash/change-multi', ProductController.TrashChangeMulti);

Router.delete('/delete/:id', ProductController.DeleteItem);

Router.get('/trash', ProductController.Trash);

Router.delete('/delete-permanently/:id', ProductController.Deletepermanetly);

Router.patch('/restore/:id', ProductController.RestoreItem);

Router.get('/create', ProductController.create);

Router.post('/create',upload.single('thumbnail'),UploadsCloud.upload,ProductValidate.createPost, ProductController.createPost);

Router.get('/edit/:id', ProductController.edit);

Router.patch('/edit/:id',upload.single('thumbnail'),ProductValidate.createPost,  ProductController.editPatch);

Router.get('/detail/:id', ProductController.detail);

module.exports = Router;