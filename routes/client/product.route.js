const express = require('express');
const ProductController = require("../../controller/client/product.controllers");
const Router = express.Router();

Router.get('/',ProductController.index)

Router.get('/detail/:slugProduct',ProductController.detail)

Router.get('/:slugProductCategory',ProductController.getProductCategory)


module.exports = Router;