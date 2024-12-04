const express = require('express');
const ProductController = require("../../controller/client/product.controllers");
const Router = express.Router();

Router.get('/',ProductController.index)

module.exports = Router;