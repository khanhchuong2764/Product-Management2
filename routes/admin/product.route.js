const express = require('express');
const ProductController =require("../../controller/admin/product.controllers");
const Router = express.Router();

Router.get('/', ProductController.index);

module.exports = Router;