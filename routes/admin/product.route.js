const express = require('express');
const ProductController =require("../../controller/admin/product.controllers");
const Router = express.Router();

Router.get('/', ProductController.index);

Router.patch('/change-status/:status/:id', ProductController.ChangeStatus);

module.exports = Router;