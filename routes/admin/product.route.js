const express = require('express');
const ProductController =require("../../controller/admin/product.controllers");
const Router = express.Router();

Router.get('/', ProductController.index);

Router.patch('/change-status/:status/:id', ProductController.ChangeStatus);

Router.patch('/change-multi', ProductController.ChangeMulti);

Router.patch('/trash/change-multi', ProductController.TrashChangeMulti);

Router.delete('/delete/:id', ProductController.DeleteItem);

Router.get('/trash', ProductController.Trash);

Router.delete('/delete-permanently/:id', ProductController.Deletepermanetly);

Router.patch('/restore/:id', ProductController.RestoreItem);

module.exports = Router;