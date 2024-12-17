const express = require('express');
const controller =require("../../controller/admin/order.controllers");
const Router = express.Router();

Router.get('/', controller.index);

module.exports = Router;